import React, { useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


// Reusable Components
const CheckBox = ({ label, checked = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked, label)}
        className="accent-primary-500"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, checked = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={checked}
        onChange={() => onChange(label)}
        className="accent-primary-500"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
    const navigate = useNavigate()
    const[openFilters, setOpenFIlters] = useState(false)
    const roomTypes = [
        'Single Bed',
        'Double Bed',
        'Luxury Room',
        'Family Suite',
    ]
    const priceRanges = [
        '0 to 500',
        '5000 to 1000',
        '1000 to 2000',
        '2000 to 3000',
    ]
    const sortOption = [
        'Price Low to High',
        'Price High to Low',
    ]
  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 px-4 md:px-16 lg:px-24 xl:px-32 '>
      {/* right */}
      <div>
            <div className='flex flex-col items-start text-left'>
                <h1 className='text-4xl md:text-[40px]'>Hotel Rooms</h1>
                <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-160'>Lorem, ipsum dolor sit amet consectetur
                     adipisicing elit. Reprehenderit velit 
                     
                     minima aliquid, omnis cum corrupti enim qui!</p>
            </div>
            {roomsDummyData.map((room)=>(
                <div className='flex flex-col md:flex-row items-start py-10 border-b border-gray-300 last:pb-30 last:border-0 gap-5 ' key={room._id} >
                    <img onClick={()=>{navigate(`/rooms/${room._id}`); scrollTo(0,0)}} src={room.images[0]} alt="" title='View Room Details'className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                    <div className='md:w-1/2 flex flex-col gap-2'>
                        <p className='text-gray-500'>{room.hotel.city}</p>
                        <p className=' cursor-pointer text-gray-500 text-3xl' onClick={()=>{navigate(`/rooms/${room._id}`); scrollTo(0,0)}}>{room.hotel.name}</p>
                        <div className='flex items-center'>
                            <img src={assets.starIconFilled} alt="" />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                        <div className='flex items-center gap-2 text-gray-500 mt-2 text-sm'>
                            <img src={assets.locationIcon} alt="" />
                            <p>{room.hotel.address}</p>
                        </div>
                        <div className='flex flex-wrap mt-3 mb-6 gap-3'>
                            {room.amenities.map((item, index)=>(
                                <div key={index} className='flex gap-1 px-3 py-2 bg-gray-500 rounded-lg items-center '>
                                    <img src={facilityIcons[item]} alt="" className='w-5 h-5' />
                                    <p className='text-xs'>{item}</p>
                                </div>
                            ))}
                        </div>

                        <p className='text-xl font-medium text-gray-700'>${room.pricePerNight}/Night</p>
                    </div>
                </div>
            ))}
      </div>
      {/* right */}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mb-16 p-3'>
         <div className={`flex justify-between items-center px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters&&"border-b"}`}>
            <p className='text-base font-medium text-gray-800'>FILTERS</p>
            <div className='text-xs cursor-pointer'>
                <span onClick={()=>setOpenFIlters(!openFilters)} className='lg:hidden'>
                    {openFilters ? 'HIDE':'SHOW'}
                   </span>
                <span className='hidden lg:block'>CLEAR</span>
            </div>
         </div>
         <div className={`${openFilters ? 'h-auto':'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
            <div className='px-5 pt-5'>
                <p className='font-medium text-gray-800'>Popular filters</p>
                {roomTypes.map((room,index)=>(
                    
                    <CheckBox key={index} label={room} />
                ))}
            </div>
            <div className='px-5 pt-5'>
                <p className='font-medium text-gray-800'>Price Range</p>
                {priceRanges.map((range,index)=>(
                    <CheckBox key={index} label={`$ ${range}`} />
                ))}
            </div>
            <div className='px-5 pt-5'>
                <p className='font-medium text-gray-800'>Sort By</p>
                {sortOption.map((sort,index)=>(
                   <RadioButton key={index} label={sort}/>
                ))}
            </div>
         </div>
      </div>
    </div>
  )
}

export default AllRooms
