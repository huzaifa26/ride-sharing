import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Parent() {
  const navigate = useNavigate();
  const formRef=useRef();
  const loginParentMutation=useMutation({
    mutationFn:async ()=>{

    },
    onSuccess:()=>{

    },
    onError:()=>{

    }
  });

  const formSubmitHandler=(e)=>{
    e.preventDefault()
    // loginParentMutation.mutate();
  }
  return (
    <div className='h-[calc(100vh-64px)]  flex justify-center items-center flex-col'>
      <div className='w-80 mb-[100px]'>
        <h1 className='text-2xl font-[400] py-4'>Sign up to book a ride.</h1>
        <form ref={formRef} onSubmit={formSubmitHandler} className='flex flex-col gap-4'>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='fullName' type='text' placeholder='Enter your full name'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='email' type='email' placeholder='Enter your email'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your address'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='phone' type='number' placeholder='Enter your phone number'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='password' type='password' placeholder='Enter your password'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='confirmPassword' type='password' placeholder='Confirm your password'></input>
          <button className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300 mt-2'>Signup</button>
        </form>
      </div>
    </div>
  )
}
