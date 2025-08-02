import React, { useEffect } from "react";
import SideBar from "../../hotelOwner/SideBar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "./../../context/AppContext";

const LayOut = () => {
  const { isOwner, navigate } = useAppContext();
  useEffect(() => {
    if (!isOwner) {
      navigate("/");
    }
  }, [isOwner]);
  return (
    <div className="flex flex-col h-screen mt-30">
      <div className="flex h-full">
        <SideBar />
        <div className="flex flex-1 p-4 pt-10 md:px-10 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayOut;
