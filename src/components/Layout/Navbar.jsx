import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { FaHistory } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(queryClient.getQueryData(['user']));
  }, []);

  const logoutHandler = () => {
    localStorage.clear();
    queryClient.resetQueries();
    navigate("/")
  }

  return (
    <div className='w-full'>
      <div className='bg-black text-white h-16 px-[6%] flex items-center justify-between relative'>
        <h1 className='text-xl font-bold cursor-pointer' onClick={() => {
          if((location.pathname.includes("/book-ride") || location.pathname.includes("/ride") || location.pathname.includes("/history-page")) && queryClient.getQueryData(['user'])?.userType === "Parent"){
            navigate("/book-ride");
            return
          }
          if((location.pathname.includes("/book-ride") || location.pathname.includes("/ride") || location.pathname.includes("/history-page")) && queryClient.getQueryData(['user'])?.userType === "Driver"){
            navigate("/rides");
            return
          }
          navigate("/")
        }} >RideSharing</h1>
        {
          location.pathname === "/" &&
          <button className='w-20 bg-white text-black h-8 rounded-lg hover:bg-[rgba(255,255,255,0.9)] transition-color duration-300'>Sign up</button>
        }
        {
          location.pathname.includes("/signup") &&
          <button className='w-20 bg-white text-black h-8 rounded-lg hover:bg-[rgba(255,255,255,0.9)] transition-color duration-300'>Login</button>
        }

        {(location.pathname.includes("/book-ride") || location.pathname.includes("/ride") || location.pathname.includes("/history-page")) &&
          <div className='flex items-center justify-center gap-2 relative group cursor-pointer py-2'>
            <div className='border-2 border-white rounded-full p-2'>
              <FaUser className='text-lg' />
            </div>
            {/* <div className='select-none'>
              <h1 className='text-[14px]'>{user?.fullName}</h1>
              <h1 className='text-[14px]'>{user?.userType}</h1>
            </div> */}
            <TbTriangleInvertedFilled className='text-sm' />
            <ul className='group-hover:max-h-[1000px] top-full max-h-0 overflow-hidden absolute transition-all duration-300 flex flex-col bg-white text-black divide-y-2 shadow-md rounded-sm'>
              <li className='p-6 py-4 pr-24 hover:bg-[#d7d7d750] flex items-center gap-2 text-[16px] font-[500]'><ImProfile className="text-lg" />Profile</li>
              <li onClick={() => navigate("/history-page")} className='p-6 py-4 pr-24 hover:bg-[#d7d7d750] flex items-center gap-2 text-[16px] font-[500]'><FaHistory className="text-lg" />History</li>
              <li onClick={() => logoutHandler()} className='p-6 py-4 pr-24 hover:bg-[#d7d7d750] flex items-center gap-2 text-[16px] font-[500]'><BiLogOut className="text-lg" />Logout</li>
            </ul>
          </div>
        }
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
