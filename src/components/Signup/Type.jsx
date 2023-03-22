import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {BiErrorCircle} from "react-icons/bi"

export default function Type() {
  const navigate = useNavigate();
  const [signupType, setSignupType] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const signuptypeHandler = () => {
    console.log(signupType);

    if (signupType === "Parent") {
      navigate("/signup/parent");
    } else if (signupType === "Driver") {
      navigate("/signup/driver");
    } else if (!signupType) {
      setShowErrorMessage(true);
      setTimeout(()=>{
        setShowErrorMessage(false);
      },3000)
    }
  }

  return (
    <div className='h-[calc(100vh-64px)]  flex justify-center items-center flex-col'>
      <div className='w-80 mb-[100px]'>
        <h1 className='text-2xl font-[400] py-4'>Choose account type.</h1>
        <div className='flex flex-col gap-4 relative'>
          <select onChange={(e) => setSignupType(e.target.value)} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
            <option selected disabled value={null}>Account type</option>
            <option value={"Parent"}>Sign up to book a ride.</option>
            <option value={"Driver"}>Sign up to drive.</option>
          </select>
          {showErrorMessage &&
          <div className='flex items-center gap-[5px] absolute top-[40px]'>
            <BiErrorCircle className='text-[red] '/>
            <p className='text-[red] text-[14px] '>You have not selected any option.</p>
          </div>
          }
          <button onClick={signuptypeHandler} className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300 mt-4'>Continue</button>
        </div>
      </div>
    </div>
  )
}
