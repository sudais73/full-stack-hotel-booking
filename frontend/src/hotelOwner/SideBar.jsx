import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const sideBarItems = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "Room List", path: "/owner/room-list", icon: assets.listIcon },
  ];
  return (
    <div className="w-16 md:w-64 border-r border-gray-300 h-full text-base pt-4 flex flex-col transition-all duration-300">
      {sideBarItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          end={item.path === "/owner"}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-8 gap-3 ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600"
                : "hover:bg-gray-100/90 border-white text-gray-700"
            }`
          }
        >
          <img src={item.icon} alt="" className="min-h-6 min-w-6" />
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
