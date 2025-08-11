import React, { useMemo, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';

// Reusable Checkbox
const CheckBox = ({ label, checked = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked, label)}
      className="accent-primary-500"
      aria-label={`Filter by ${label}`}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

// Reusable Radio Button
const RadioButton = ({ label, checked = false, onChange = () => {}, name }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={() => onChange(label)}
      className="accent-primary-500"
      aria-label={`Sort by ${label}`}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

// Room Card
const RoomCard = ({ room, navigateToRoom }) => (
  <div className="flex flex-col md:flex-row items-start py-10 border-b border-gray-200 last:border-0 gap-6">
    <img
      onClick={() => navigateToRoom(room._id)}
      src={room.images?.[0] || assets.roomPlaceholder}
      alt={`${room.hotel?.name || 'Hotel'} room`}
      className="w-full md:w-1/2 h-64 rounded-xl shadow-md object-cover cursor-pointer hover:shadow-lg transition-shadow"
      onError={(e) => {
        e.target.src = assets.roomPlaceholder;
      }}
    />
    <div className="w-full md:w-1/2 flex flex-col gap-2">
      <p className="text-gray-500 uppercase text-sm">{room.hotel?.city || 'Unknown city'}</p>
      <h2
        onClick={() => navigateToRoom(room._id)}
        className="cursor-pointer text-2xl font-semibold text-gray-800 hover:text-primary-600 transition-colors"
      >
        {room.hotel?.name || 'Unknown hotel'}
      </h2>
      <div className="flex items-center">
        <img src={assets.starIconFilled} alt="Star rating" className="w-5 h-5" />
        <p className="ml-2 text-gray-600">{(room.reviewsCount || 200)}+ reviews</p>
      </div>
      <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
        <img src={assets.locationIcon} alt="Location" className="w-4 h-4" />
        <p>{room.hotel?.address || 'Address not available'}</p>
      </div>
      <div className="flex flex-wrap mt-3 mb-4 gap-2">
        {room.amenities?.map((item, index) => (
          <div
            key={index}
            className="flex gap-1 px-3 py-1.5 bg-gray-100 rounded-lg items-center"
          >
            <p className="text-xs text-gray-700">{item}</p>
          </div>
        ))}
      </div>
      <p className="text-xl font-medium text-primary-600">
        ${Number(room.pricePerNight || 0).toLocaleString()}/Night
      </p>
    </div>
  </div>
);

const AllRooms = () => {
  const [searchParams] = useSearchParams();
  const { navigate, rooms } = useAppContext();
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState({
    roomTypes: [],
    priceRange: null,
    sortOption: null,
  });

  // Constants
  const ROOM_TYPES = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
  const PRICE_RANGES = [
    { value: '0-500', label: '$0 - $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: '1000-2000', label: '$1000 - $2000' },
    { value: '2000-3000', label: '$2000 - $3000' },
  ];
  const SORT_OPTIONS = ['Price Low to High', 'Price High to Low', 'Newest First'];

  // Filter handlers
  const handleRoomTypeChange = (checked, roomType) => {
    setFilters(prev => ({
      ...prev,
      roomTypes: checked
        ? [...prev.roomTypes, roomType]
        : prev.roomTypes.filter(type => type !== roomType),
    }));
  };

  const handlePriceRangeChange = (priceRange) => {
    setFilters(prev => ({
      ...prev,
      priceRange: priceRange === prev.priceRange ? null : priceRange,
    }));
  };

  const handleSortOptionChange = (sortOption) => {
    setFilters(prev => ({
      ...prev,
      sortOption: sortOption === prev.sortOption ? null : sortOption,
    }));
  };

  const clearFilters = () => {
    setFilters({
      roomTypes: [],
      priceRange: null,
      sortOption: null,
    });
  };

  // Utility to get a robust room-type string to match against filters
  const getRoomTypeString = (room) => {
    // try multiple fields that might contain the type
    const candidates = [
      room.roomType,
      room.type,
      room.name,
      room.title,
      room.room_name,
    ];
    const joined = candidates.filter(Boolean).join(' ').trim();
    return joined.toLowerCase();
  };

  // Filter + Sort
  const filteredRooms = useMemo(() => {
    if (!rooms || !Array.isArray(rooms)) return [];

    return rooms
      .filter((room) => {
        // Destination filter (from query string)
        const destination = searchParams.get('destination');
        if (
          destination &&
          !room.hotel?.city?.toLowerCase().includes(destination.toLowerCase())
        ) {
          return false;
        }

        // ROOM TYPE filter (robust matching)
        if (filters.roomTypes.length > 0) {
          const roomTypeVal = getRoomTypeString(room);
          if (!roomTypeVal) return false;

          const matches = filters.roomTypes.some((filterType) => {
            const f = filterType.toLowerCase().trim();
            // forgiving matching:
            // - filter contained in room's string
            // - room's string contained in filter
            // - or any word overlap
            if (roomTypeVal.includes(f) || f.includes(roomTypeVal)) return true;

            const roomWords = roomTypeVal.split(/\s+/);
            const filterWords = f.split(/\s+/);
            // overlap test: any filter word appearing in roomWords
            if (filterWords.some(w => roomWords.some(rw => rw.includes(w)))) return true;
            if (roomWords.some(rw => filterWords.some(w => w.includes(rw)))) return true;

            return false;
          });

          if (!matches) return false;
        }

        // PRICE RANGE filter
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          const price = Number(room.pricePerNight);
          if (isNaN(price) || price < min || price > max) return false;
        }

        // passed all filters
        return true;
      })
      .sort((a, b) => {
        if (filters.sortOption === 'Price Low to High') {
          return (Number(a.pricePerNight) || 0) - (Number(b.pricePerNight) || 0);
        }
        if (filters.sortOption === 'Price High to Low') {
          return (Number(b.pricePerNight) || 0) - (Number(a.pricePerNight) || 0);
        }
        if (filters.sortOption === 'Newest First') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [rooms, filters, searchParams]);

  const navigateToRoom = (roomId) => {
    navigate(`/rooms/${roomId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between pt-28 px-4 md:px-16 lg:px-24 xl:px-32 gap-8">
      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="flex flex-col items-start text-left mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Hotel Rooms</h1>
          <p className="text-base text-gray-600 mt-2 max-w-2xl">
            Discover our selection of premium accommodations tailored to meet your travel needs and preferences.
          </p>
        </div>

        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} navigateToRoom={navigateToRoom} />
          ))
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-medium text-gray-700">No rooms found matching your criteria</h3>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Filters Sidebar */}
      <div className="bg-white w-full lg:w-80 border border-gray-200 rounded-lg shadow-sm sticky top-32">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">FILTERS</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenFilters(!openFilters)}
              className="text-sm text-primary-600 hover:text-primary-800 lg:hidden"
              aria-label={openFilters ? 'Hide filters' : 'Show filters'}
            >
              {openFilters ? 'HIDE' : 'SHOW'}
            </button>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800 hidden lg:block"
              aria-label="Clear all filters"
            >
              CLEAR ALL
            </button>
          </div>
        </div>

        <div className={`${openFilters ? 'block' : 'hidden lg:block'} divide-y divide-gray-200`}>
          <div className="px-5 py-4">
            <h4 className="font-medium text-gray-800 mb-2">Room Type</h4>
            {ROOM_TYPES.map((roomType) => (
              <CheckBox
                key={roomType}
                label={roomType}
                checked={filters.roomTypes.includes(roomType)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>

          <div className="px-5 py-4">
            <h4 className="font-medium text-gray-800 mb-2">Price Range</h4>
            {PRICE_RANGES.map((range) => (
              <RadioButton
                key={range.value}
                label={range.label}
                checked={filters.priceRange === range.value}
                onChange={() => handlePriceRangeChange(range.value)}
                name="priceRange"
              />
            ))}
          </div>

          <div className="px-5 py-4">
            <h4 className="font-medium text-gray-800 mb-2">Sort By</h4>
            {SORT_OPTIONS.map((option) => (
              <RadioButton
                key={option}
                label={option}
                checked={filters.sortOption === option}
                onChange={() => handleSortOptionChange(option)}
                name="sortOption"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
