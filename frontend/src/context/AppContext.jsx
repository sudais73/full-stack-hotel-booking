/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [recentSearchedCities, setRecentSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async()=>{
    try {
      const {data} = await axios.get('/api/room/get-room')
      if(data.success){
        setRooms(data.rooms)
        
      }else{
        toast.error('error fetching the rooms')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
 
  // Fetch user on app load (if token exists)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get("/api/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
          setIsOwner(res.data.user.role === "hotelOwner");
          setRecentSearchedCities(res.data.recentSearchedCities);
        }else{
          setTimeout(()=>{
          fetchUser();
          },5000)
        }

      } catch (err) {
        toast.error("error getting a user");
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
      }
    };
    console.log(user)
    fetchUser();
  }, [user]);

   useEffect(()=>{

    fetchRooms();
  },[])
  const value = {
    axios,
    token,
    currency,
    navigate,
    rooms,
    setRooms,
    user,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    recentSearchedCities,
    setRecentSearchedCities,
    toast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
export default AppProvider;
