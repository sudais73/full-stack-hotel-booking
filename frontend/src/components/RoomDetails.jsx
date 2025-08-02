import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { rooms, token, axios, navigate } = useAppContext();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check room availability
  const checkAvailability = async () => {
    try {
      setIsLoading(true);
      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        toast.error("Check-out date must be after check-in date");
        return;
      }

      const { data } = await axios.post('/api/booking/check-availability', {
        room: roomId,
        checkInDate,
        checkOutDate
      });

      if (data.success) {
        setIsAvailable(data.isAvailable);
        toast[data.isAvailable ? "success" : "error"](
          data.isAvailable ? "Room is available!" : "Room is not available for these dates"
        );
      } else {
        toast.error(data.msg || "Error checking availability");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAvailable) {
        await checkAvailability();
      } else {
        setIsLoading(true);
        const { data } = await axios.post(
          '/api/booking/book',
          {
            room: roomId,
            checkInDate,
            checkOutDate,
            guests,
            paymentMethod: "Pay for hotel"
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("Booking confirmed!");
          navigate("/my-booking");
          window.scrollTo(0, 0);
        } else {
          toast.error(data.msg || "Booking failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Booking error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle check-in date change
  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value;
    setCheckInDate(selectedDate);
    
    // Reset checkout if new check-in is after current checkout
    if (checkOutDate && selectedDate > checkOutDate) {
      setCheckOutDate("");
      setIsAvailable(false);
    }
  };

  useEffect(() => {
    const foundRoom = rooms.find((room) => room._id === roomId);
    if (foundRoom) {
      setRoom(foundRoom);
      setMainImage(foundRoom.images[0]);
    }
  }, [roomId, rooms]);

  if (!room) return <div className="py-28 px-4 text-center">Loading room details...</div>;

  return (
    <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Room Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {room.hotel.name} <span className="font-normal text-sm">({room.roomType})</span>
          </h1>
          <span className="text-xs font-medium py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center">
            <img src={assets.starIconFilled} alt="Rating" className="w-4 h-4" />
            <span className="ml-1">4.8</span>
          </div>
          <span>•</span>
          <p className="text-gray-600">200+ reviews</p>
          <span>•</span>
          <div className="flex items-center text-gray-600">
            <img src={assets.locationIcon} alt="Location" className="w-4 h-4 mr-1" />
            <p>{room.hotel.address}</p>
          </div>
        </div>
      </div>

      {/* Room Images */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="lg:w-2/3">
          <img
            src={mainImage}
            alt="Main room"
            className="w-full h-96 rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="lg:w-1/3 grid grid-cols-2 gap-4">
          {room.images.filter(img => img !== mainImage).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Room view ${index + 1}`}
              onClick={() => setMainImage(image)}
              className={`w-full h-44 rounded-md object-cover cursor-pointer transition ${
                mainImage === image ? "ring-2 ring-orange-500" : "hover:opacity-90"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Room Highlights */}
      <div className="flex flex-col md:flex-row justify-between mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Room Amenities</h2>
          <div className="flex flex-wrap gap-3">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
              >
                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <p className="text-2xl font-semibold text-gray-800">
            ${room.pricePerNight} <span className="text-lg font-normal text-gray-500">/ night</span>
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <form 
        onSubmit={onSubmitHandler} 
        className="bg-white shadow-lg rounded-xl p-6 mb-16"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full">
            {/* Check-In */}
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="checkInDate" className="block font-medium mb-1">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                value={checkInDate}
                onChange={handleCheckInChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Check-Out */}
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="checkoutDate" className="block font-medium mb-1">
                Check-Out
              </label>
              <input
                type="date"
                id="checkoutDate"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                disabled={!checkInDate}
                className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !checkInDate ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
              />
            </div>

            {/* Guests */}
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="guests" className="block font-medium mb-1">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                min="1"
                max="4"
                value={guests}
                onChange={(e) => setGuests(Math.min(4, Math.max(1, e.target.value)))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto mt-6 md:mt-0 px-8 py-3.5 rounded-lg font-medium text-white transition ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 active:bg-green-800"
            }`}
          >
            {isLoading ? "Processing..." : isAvailable ? "Book Now" : "Check Availability"}
          </button>
        </div>
      </form>

      {/* Room Specifications */}
      <div className="space-y-6 mb-12">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-4">
            <img src={spec.icon} alt="" className="w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium">{spec.title}</h3>
              <p className="text-gray-600">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="border-t border-b border-gray-200 py-10 mb-12">
        <p className="text-gray-700 leading-relaxed">
          Welcome to {room.hotel.name}, an exquisite retreat designed for discerning travelers 
          seeking relaxation, sophistication, and unparalleled service. Nestled in the heart 
          of {room.hotel.address}, our hotel blends modern elegance with timeless charm, offering 
          a sanctuary of comfort for both business and leisure guests.
        </p>
      </div>

      {/* Host Information */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={room.hotel.owner.image} 
            alt={`Host ${room.hotel.owner.username}`} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">Hosted by {room.hotel.owner.username}</p>
            <p className="text-sm text-gray-600">Superhost • 5 years hosting</p>
          </div>
        </div>
        <button
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          Contact Host
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;