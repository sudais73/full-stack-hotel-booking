import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const { user, axios, token } = useAppContext();
  // fetch rooms of the hotel owner//
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setRooms(data.rooms);
      }
      console.log(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  // toggle availability//
  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.post(
        "/api/room/toggle",
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.msg);
        fetchRooms();
      } else {
        toast.error("cannot update Availability of this room");
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };
  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);
  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms keep the information up to date to provide the best experience for users"
      />
      <h1 className="text-gray-800 mt-8">All Rooms</h1>
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Facility
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Price / Night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.amenities.join(", ")}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  ${item.pricePerNight}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center">
                  <label className="relative inline-flex items-center cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isAvailable}
                      onChange={() => toggleAvailability(item._id)}
                      id={`availability-toggle-${item._id}`}
                    />
                    <div
                      className="
    w-12 h-7
    bg-gray-300
    rounded-full
    peer
    peer-checked:bg-blue-600
    peer-disabled:opacity-50
    peer-disabled:cursor-not-allowed
    transition-colors duration-200
  "
                    ></div>
                    <div
                      className="
    absolute
    left-1
    top-1
    w-5 h-5
    bg-white
    rounded-full
    shadow-sm
    transition-transform duration-200
    peer-checked:translate-x-5
  "
                    ></div>
                    <span className="sr-only">Toggle Availability</span>{" "}
                    {/* Screen reader text */}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
