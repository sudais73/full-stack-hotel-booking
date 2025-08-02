import React from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const FeatureDestination = () => {

  const{rooms, navigate} = useAppContext()
  return rooms.length > 0 && (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 mt-10">
      <Title
        title="Feature Destination"
        subTitle="Voluptatibus hic eos suscipit amet atque impedit tempore recusandae autem, nulla porro minima laboriosam quod tenetur veritatis. Voluptates dignissimos nemo earum autem!"
      />
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 tex-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View All Destination
      </button>
    </div>
  );
};

export default FeatureDestination;
