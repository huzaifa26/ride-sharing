import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { API_URL } from '../Utils/const';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const formRef=useRef();
  const queryClient=useQueryClient()

  const signupDriverMutation = useMutation({
    mutationFn: async (data) => {
      const user=queryClient.getQueryData(["user"]);
      console.log(user)
      data.id=user.id;
      return axios.put(API_URL + "user/", data)
    },
    onSuccess: (res) => {
      toast.success("Profile completed. Redirecting to home page.");
      localStorage.setItem("user",JSON.stringify(res.data.user));
      queryClient.setQueryData(["user"], res.data.user);
      setTimeout(() => {
        navigate("/book-ride");
      }, 2000);
    },
    onError: (error) => {
      console.log(error)
      toast.error("Profile completion failed");
    }
  });

  const formSubmitHandler=(e)=>{
    e.preventDefault();

    const data = {
      criminalRecord: formRef.current.criminalRecord.value === "true" ? true : false,
      isInsured: formRef.current.isInsured.value === "true" ? true : false,
      insuranceCompany: formRef.current.insuranceCompany.value,
      carName: formRef.current.carName.value,
      carModel: formRef.current.carModel.value,
      carRegisteration: formRef.current.carRegisteration.value,
    }
    signupDriverMutation.mutate(data);
  }

  return (
    <div className='h-[calc(100vh-64px)]  flex justify-center items-center flex-col'>
      <div className='w-80 mb-[100px]'>
        <h1 className='text-2xl font-[400] py-4 '>Please provide additional information to continue.</h1>
        <form ref={formRef} onSubmit={formSubmitHandler} className='flex flex-col gap-4'>
          <select name="criminalRecord" className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
            <option selected disabled value={null}>Do you have criminal record?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <select name="isInsured" className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
            <option selected disabled value={null}>Is your car insured?</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='insuranceCompany' type='text' placeholder='Enter your insurance company name'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='carName' type='text' placeholder='Enter your car name'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='carModel' type='text' placeholder='Enter your car model'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='carRegisteration' type='text' placeholder='Enter your car registeration number'></input>
          <button className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300 mt-2'>Continue</button> 
        </form>
      </div>
    </div>
  )
}
