import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets } from "./../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, token, axios } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });
  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/booking/hotel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast("error fetching dashboard data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div>
      <Title
        align="left"
        title="Dashboard"
        subTitle="monitor your room listings, track bookings and analysis 
      revenue-all in one place. stay updated with real time insights to ensure smooth operation"
      />
      <div className="flex gap-4 my-8">
        {/* total bookings */}
        <div className="bg-gray-600  border-gray-300 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>
        {/* total revenue */}
        <div className="bg-gray-600  border-gray-300 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">
              $ {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>
      {/* recent booking */}
      <h1 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Bookings
      </h1>

      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Room Name
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Total Amount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashboardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                  {item.user.username}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                  {item.room.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  ${item.totalPrice}
                </td>
                <td className="py-3 px-4 border-t border-gray-300 flex">
                  <button
                    className={`py-1 px-3 text-xs rounded-full mx-auto ${
                      item.isPaid ? "bg-green-600" : "bg-amber-200"
                    }`}
                  >
                    {item.isPaid ? "Completed" : "Pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
