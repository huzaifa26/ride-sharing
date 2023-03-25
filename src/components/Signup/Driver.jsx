import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { API_URL } from '../Utils/const';

export default function Driver() {
  const navigate = useNavigate();
  const formRef = useRef();

  const signupDriverMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(API_URL + "user/", data)
    },
    onSuccess: () => {
      toast.success("Signup successful. Redirecting to login page.");
      navigate("/");
    },
    onError: (error) => {
      console.log(error)
      toast.error("Signup failed");
    }
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (formRef.current.password.value !== formRef.current.confirmPassword.value) {
      toast.error("Password doesnot match.");
      return
    }

    const data = {
      email: formRef.current.email.value,
      fullName: formRef.current.fullName.value,
      address: formRef.current.address.value,
      phoneNumber: formRef.current.phoneNumber.value,
      password: formRef.current.password.value,
      userType: "Driver",
      isProfileCompleted: false,
      isAvailable: false,
    }
    signupDriverMutation.mutate(data);
  }
  return (
    <div className='h-[calc(100vh-64px)]  flex justify-center items-center flex-col'>
      <div className='w-80 mb-[100px]'>
        <h1 className='text-2xl font-[400] py-4 '>Sign up to drive.</h1>
        <form ref={formRef} onSubmit={formSubmitHandler} className='flex flex-col gap-4'>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='fullName' type='text' placeholder='Enter your full name'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='email' type='email' placeholder='Enter your email'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your address'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='phoneNumber' type='number' placeholder='Enter your phone number'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='password' type='password' placeholder='Enter your password'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='confirmPassword' type='password' placeholder='Confirm your password'></input>
          {/* <select onChange={(e) => setSignupType(e.target.value)} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
            <option selected disabled value={null}>Do you have criminal record?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <select onChange={(e) => setSignupType(e.target.value)} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
            <option selected disabled value={null}>Is your car insured?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select> */}
          {/* <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your insurance company name'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your car name'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your car model'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your car registeration number'></input>*/}
          <button className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300 mt-2'>Signup</button>
        </form>
      </div>
    </div>
  )
}
