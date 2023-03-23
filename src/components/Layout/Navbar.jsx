import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation();

  return (
    <div className='w-full'>
      <div className='bg-black text-white h-16 px-[6%] flex items-center justify-between'>
        <Link to={"/"}>
          <h1 className='text-xl font-bold'>RideSharing</h1>
        </Link>
        {
          location.pathname === "/" &&
          <button className='w-20 bg-white text-black h-8 rounded-lg hover:bg-[rgba(255,255,255,0.9)] transition-color duration-300'>Sign up</button>
        }
        {
          location.pathname.includes("/signup") &&
          <button className='w-20 bg-white text-black h-8 rounded-lg hover:bg-[rgba(255,255,255,0.9)] transition-color duration-300'>Login</button>
        }
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
