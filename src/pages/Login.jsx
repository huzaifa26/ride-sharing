import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../components/Utils/const';

export default function Login() {
  const navigate = useNavigate();
  const formRef = useRef();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(API_URL + "login-user/", data)
    },
    onSuccess: (res) => {
      localStorage.setItem("user",JSON.stringify(res.data.user));
      queryClient.setQueryData(["user"], res.data.user);
      toast.success(res.data.message);
      if(res.data.user.userType === "Driver" && res.data.user.isProfileCompleted === false){
        navigate("/complete-profile");
        return
      }
      navigate("/book-ride");
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.response?.data?.error || "Login failed.");
    }
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const data = {
      email: formRef.current.email.value,
      password: formRef.current.password.value,
    }
    loginMutation.mutate(data);
  };

  return (
    <div className='h-[calc(100vh-64px)]  flex justify-center items-center flex-col'>
      <div className='w-80 mb-[100px]'>
        <h1 className='text-2xl font-[400] py-4'>Login to your Ridesharing account.</h1>
        <form onSubmit={formSubmitHandler} ref={formRef} className='flex flex-col gap-4'>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='email' type='text' placeholder='Enter your email'></input>
          <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='password' type='password' placeholder='Enter your password'></input>
          <button className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300 mt-2'>Login</button>
        </form>
        <div className='flex justify-center items-center gap-2 my-4'>
          <div className='min-h-[1px] flex-1 bg-[#D7D7D7]'></div>
          <div className='text-[#D7D7D7]'>or</div>
          <div className='min-h-[1px] flex-1 bg-[#D7D7D7]'></div>
        </div>
        <button onClick={() => navigate("/signup")} className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Sign up</button>
      </div>
    </div>
  )
}
