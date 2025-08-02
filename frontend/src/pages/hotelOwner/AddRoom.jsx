import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {
  const { axios, token } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  })

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Room service': false,
      'Pool Access': false,
    }
  })

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const missingImages = Object.values(images).filter(img => !img).length
    const selectedAmenities = Object.values(inputs.amenities).filter(a => a).length
    
    if (!inputs.roomType) {
      toast.error("Please select room type")
      return
    }
    
    if (!inputs.pricePerNight || inputs.pricePerNight <= 0) {
      toast.error("Please enter valid price")
      return
    }
    
    if (missingImages > 0) {
      toast.error(`Please upload all 4 images (${4 - missingImages} remaining)`)
      return
    }
    
    if (selectedAmenities === 0) {
      toast.error("Please select at least one amenity")
      return
    }

    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerNight', inputs.pricePerNight)
      
      // Add selected amenities
      const amenities = Object.keys(inputs.amenities)
        .filter(key => inputs.amenities[key])
      formData.append('amenities', JSON.stringify(amenities))
      
      // Add all images
      Object.values(images).forEach(image => {
        formData.append('images', image)
      })

      const { data } = await axios.post('/api/room/add', formData, {
        headers: {
          Authorization: `Bearer ${await token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success(data.msg)
        // Reset form
        setInputs({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room service': false,
            'Pool Access': false,
          }
        })
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        })
      } else {
        toast.error(data.msg || "Error adding room")
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <Title 
        align='left' 
        title="Add Room" 
        subTitle='Fill all details carefully including room type, pricing, amenities, and all 4 images' 
      />
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">Loading, please wait...</div>
        </div>
      )}

      {/* Images upload section */}
      <div className="mb-6">
        <p className='text-gray-800 font-medium mb-2'>
          Images <span className="text-red-500">*</span>
          <span className="text-sm text-gray-500 ml-2">(All 4 required)</span>
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {Object.entries(images).map(([key, value]) => (
            <label 
              key={key}
              htmlFor={`roomImages${key}`}
              className={`border-2 rounded-md p-2 flex flex-col items-center ${
                value ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <img 
                src={value ? URL.createObjectURL(value) : assets.uploadArea} 
                alt={`Preview ${key}`}
                className="h-24 w-full object-cover mb-2"
              />
              <span className="text-sm">
                {value ? 'Uploaded' : 'Click to upload'}
              </span>
              <input
                type="file"
                id={`roomImages${key}`}
                onChange={(e) => setImages({...images, [key]: e.target.files[0]})}
                accept="image/*"
                className="hidden"
                required
              />
            </label>
          ))}
        </div>
      </div>

      {/* Room details section */}
      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <div>
          <label className="block text-gray-800 font-medium mb-2">
            Room Type <span className="text-red-500">*</span>
          </label>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({...inputs, roomType: e.target.value})}
            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-800 font-medium mb-2">
            Price/Night <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <input
              type="number"
              min="1"
              value={inputs.pricePerNight}
              onChange={(e) => setInputs({...inputs, pricePerNight: e.target.value})}
              className='w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>
      </div>

      {/* Amenities section */}
      <div className="mb-6">
        <label className="block text-gray-800 font-medium mb-2">
          Amenities <span className="text-red-500">*</span>
          <span className="text-sm text-gray-500 ml-2">(At least 1 required)</span>
        </label>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {Object.entries(inputs.amenities).map(([amenity, checked]) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !checked
                  }
                })}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 rounded-md text-white font-medium ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Add Room'}
      </button>
    </form>
  )
}

export default AddRoom