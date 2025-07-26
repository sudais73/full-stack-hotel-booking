import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  assets,
  facilityIcons,
  roomCommonData,
  roomsDummyData,
} from "../assets/assets";

const RoomDetails = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    const room = roomsDummyData.find((room) => room._id === roomId);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, []);
  return (
    room && (
      <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room details */}
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center ">
          <h1 className="text-3xl md:text-4xl ">
            {room.hotel.name}(
            <span className="font-inter text-sm">{room.roomType}</span> )
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>
        {/* rooms rating */}

        <div className="flex items-center gap-1 mt-3">
          <img src={assets.starIconFilled} alt="" />
          <p className="ml-2">200+ reviews</p>
        </div>

        {/* room address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="" />
          <p>{room.hotel.address}</p>
        </div>
        {/* room images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="ld:w-1/2 w-full">
            <img
              src={mainImage}
              alt=""
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full gap-4">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  src={image}
                  alt=""
                  key={index}
                  className={`w-full rounded-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* room highlight */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl ">
              Experience luxury like Never Before
            </h1>
            <div className="flex flex-wrap mt-3 mb-6 gap-3">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-1 px-3 py-2 bg-gray-500 rounded-lg items-center "
                >
                  <img src={facilityIcons[item]} alt="" className="w-5 h-5" />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-2xl font-medium text-gray-700">
            ${room.pricePerNight}/Night
          </p>
        </div>
        {/* chechin checkout */}
        <form className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-8 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="checkoutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkoutDate"
                placeholder="Check-out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="Number"
                min={1}
                max={4}
                id="guests"
                placeholder="0"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-orange-dull active:scale-95 transition-all text-white rounded-md max-w-full max-md:mt-6 md:px-25 py- md:py-4 text-base cursor-pointer"
          >
            Check Availability
          </button>
        </form>
        {/* common specification */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} alt="" className="w-6" />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Welcome to Luxury Haven Hotel, an exquisite retreat designed for
            discerning travelers seeking relaxation, sophistication, and
            unparalleled service. Nestled in the heart of [location], our hotel
            blends modern elegance with timeless charm, offering a sanctuary of
            comfort for both business and leisure guests. Unrivaled
            Accommodations Indulge in our meticulously designed rooms and
            suites, each featuring plush bedding, sleek contemporary decor, and
            state-of-the-art amenities. Enjoy breathtaking [city/ocean/mountain]
            views, high-speed Wi-Fi, smart TVs, and luxurious marble bathrooms
            with premium toiletries.
          </p>
        </div>
        {/* hostedby */}
        <div className="flex flex-col items-start gap-4">
            <div className="flex gap-4">
                <img src={room.hotel.owner.image} alt="Hoster Image" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
                <p className="text-lg md:text-xl">Hosted By {room.hotel.owner.username}</p>
            </div>
             <button
            type="submit"
            className="bg-green-600 hover:bg-orange-dull active:scale-95 transition-all text-white rounded-md max-w-full max-md:mt-6 md:px-25 py- md:py-4 text-base cursor-pointer"
          >
            Contact now
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
