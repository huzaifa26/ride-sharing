import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../components/Utils/const';

export default function Profile() {

  const navigate=useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState();
  const formRef = useRef();

  useEffect(() => {
    setUser(queryClient.getQueryData(['user']));
  }, []);

  const editUserMutation = useMutation({
    mutationFn: async (newData) => {
      return axios.put(API_URL + "/profile", newData)
    },
    onSuccess: (res) => {
      console.log(res);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      queryClient.setQueryData(["user"], res.data.user);
      toast.success("Profile updated successfully");
      if(res.data.user.userType === "Driver"){
        navigate("/rides");
      } else if(res.data.user.userType === "Parent"){
        navigate("/book-ride");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error applying changes");
    }
  });

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (user.userType === "Driver") {
      var newData = {
        id: user.id,
        email: formRef.current.email.value,
        fullName: formRef.current.fullName.value,
        address: formRef.current.address.value,
        phoneNumber: formRef.current.phoneNumber.value,
        criminalRecord: formRef.current.criminalRecord.value === "true" ? true : false,
        isInsured: formRef.current.isInsured.value === "true" ? true : false,
        insuranceCompany: formRef.current.insuranceCompany.value,
        carName: formRef.current.carName.value,
        carModel: formRef.current.carModel.value,
        carRegisteration: formRef.current.carRegisteration.value,
      }
    } else if (user.userType === "Parent") {
      var newData = {
        id: user.id,
        email: formRef.current.email.value,
        fullName: formRef.current.fullName.value,
        address: formRef.current.address.value,
        phoneNumber: formRef.current.phoneNumber.value,
      }
    }

    const isFormEdited = Object.keys(newData).some((fieldName, index) => {
      console.log(newData[fieldName], user[fieldName])
      return newData[fieldName] !== user[fieldName]
    });

    console.log(isFormEdited);

    if (!isFormEdited) {
      toast.info("Nothing has been changed");
      return;
    }
    editUserMutation.mutate(newData);
  }

  return (
    <div className='w-[86%] min-h-[calc(100vh-64px)] m-auto'>
      <h1 className='text-2xl font-[500] mt-4'>Edit Profile</h1>
      <form ref={formRef} onSubmit={formSubmitHandler} className='flex flex-col gap-6'>
        <div className='xsm:flex-col sm:flex-col flex gap-[5%]'>
          <div className='w-[40%] xsm:w-[80%] sm:w-[80%] flex flex-col gap-6 mt-4'>
            <div className='space-y-2'>
              <label className='text-lg font-[500]'>Full Name</label>
              <input defaultValue={user?.fullName} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='fullName' type='text' placeholder='Enter your full name'></input>
            </div>

            <div className='space-y-2'>
              <label className='text-lg font-[500]'>Email</label>
              <input defaultValue={user?.email} disabled className='opacity-50 cursor-not-allowed w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='email' type='email' placeholder='Enter your email'></input>
            </div>

            <div className='space-y-2'>
              <label className='text-lg font-[500]'>Address</label>
              <input defaultValue={user?.address} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='address' type='text' placeholder='Enter your address'></input>
            </div>

            <div className='space-y-2'>
              <label className='text-lg font-[500]'>Phone Number</label>
              <input defaultValue={user?.phoneNumber} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='phoneNumber' type='number' placeholder='Enter your phone number'></input>
            </div>
            {user?.userType === "Driver" &&
              <>
                <div className='space-y-2'>
                  <label className='text-lg font-[500]'>Ciminal Record</label>
                  <select defaultValue={user?.criminalRecord} name="criminalRecord" className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
                    <option selected disabled value={null}>Do you have criminal record?</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </>
            }
          </div>
          {user?.userType === "Driver" &&
            <div className='w-[40%] xsm:w-[80%] sm:w-[80%] mt-4 flex flex-col gap-6'>
              <div className='space-y-2'>
                <label className='text-lg font-[500]'>Car Insurance</label>
                <select defaultValue={user?.isInsured} name="isInsured" className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2'>
                  <option selected disabled value={null}>Is your car insured?</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>

              <div className='space-y-2'>
                <label className='text-lg font-[500]'>Insurance Company</label>
                <input defaultValue={user?.insuranceCompany} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='insuranceCompany' type='text' placeholder='Enter your insurance company name'></input>
              </div>

              <div className='space-y-2'>
                <label className='text-lg font-[500]'>Car Name</label>
                <input defaultValue={user?.carName} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='carName' type='text' placeholder='Enter your car name'></input>
              </div>

              <div className='space-y-2'>
                <label className='text-lg font-[500]'>Car Model</label>
                <input defaultValue={user?.carModel} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='carModel' type='text' placeholder='Enter your car model'></input>
              </div>

              <div className='space-y-2'>
                <label className='text-lg font-[500]'>Car Registeration</label>
                <input defaultValue={user?.carRegisteration} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' name='carRegisteration' type='text' placeholder='Enter your car registeration number'></input>
              </div>
            </div>
          }
        </div>
        <button className='h-10 w-[120px] mb-[50px] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Update</button>
      </form>
    </div>
  )
}
