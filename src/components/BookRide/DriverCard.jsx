import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React from 'react'
import { API_URL } from '../Utils/const';

export default function DriverCard({ driver, location }) {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user']);

  const bookRideMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(API_URL + "ride", data)
    },
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries(["drivers"]);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  function bookRideHandler() {
    let data = {
      pickup: location.pickup,
      dropoff: location.dropoff,
      isCompleted: false,
      driverId: driver.id,
      parentId: user.id,
    }
    console.log(data);
    bookRideMutation.mutate(data);
  }

  const cancelRideMutation = useMutation({
    mutationFn: async (newData) => {
      return axios.put(API_URL + "ride-request-action", newData)
    },
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries(['drivers'])
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const cancelRideHandler = (accepted=false) => {
    let newData = {
      id: driver.DriverRides[0].id,
      isAccepted: accepted,
      acceptedBy: driver.id
    }
    cancelRideMutation.mutate(newData);
  }

  return (
    <div className='w-[60%] min-h-48 shadow rounded-md p-2 min-w-[300px]'>
      <h1 className='text-lg'><span className='font-[500] text-lg'>Name: </span> {driver.fullName}</h1>
      <p className='text-md'><span className='font-[500] text-lg'>Email: </span> {driver.email}</p>
      <p className='text-md'><span className='font-[500] text-lg'>Phone Number: </span> {driver.phoneNumber}</p>
      <p className='text-md'><span className='font-[500] text-lg'>Car: </span>{driver.carName + " " + driver.carModel}</p>
      <p className='text-md'><span className='font-[500] text-lg'>Car registeration: </span> {driver.carRegisteration}</p>
      {driver.DriverRides.length === 0 &&
        <button onClick={() => bookRideHandler()} className='h-9 mt-2 w-[36%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Book</button>
      }
      {driver.DriverRides.length > 0 &&
        <button onClick={() => {cancelRideHandler()}} className='h-9 mt-2 w-[36%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Cancel Request</button>
      }
    </div>
  )
}