import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { API_URL } from '../Utils/const';

export default function DriverRideCard({ data }) {
  const queryClient = useQueryClient();

  const rideActionMutation = useMutation({
    mutationFn: async (newData) => {
      return axios.put(API_URL + "ride-request-action", newData)
    },
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries(['driver-rides'])
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const rideActionHandler = (accepted) => {
    let newData = {
      id: data.id,
      isAccepted: accepted,
      acceptedBy: data.parentId
    }
    rideActionMutation.mutate(newData);
  }

  const markRideAsCompleteMutation = useMutation({
    mutationFn: async (newData) => {
      return axios.post(API_URL + "mark-ride-complete", newData)
    },
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries(['driver-rides'])
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const markRideAsComplete = () => {
    let newData = {
      id: data.id,
      acceptedBy: data.parentId
    }
    markRideAsCompleteMutation.mutate(newData);
  }

  return (
    <div className='w-[40%] min-h-48 shadow rounded-md p-2 min-w-[300px]'>
      <h1 className='text-lg'><span className='font-[500] text-lg'>Name:</span> {data.parent.fullName}</h1>
      <p className='text-md'><span className='font-[500] text-lg'>Pick up:</span> {data.pickup}</p>
      <p className='text-md'><span className='font-[500] text-lg'>Drop off:</span> {data.dropoff}</p>
      <p className='text-md'><span className='font-[500] text-lg'>Created Time:</span> {data.createdAt}</p>
      {data.isAccepted === null && data.isCompleted === false &&
        <div className='flex gap-3 mt-3 mb-3'>
          <button onClick={() => { rideActionHandler(false) }} className='h-9 w-[36%] border-2 border-black bg-white rounded-lg text-black font-bold hover:bg-[#D7D7D7] transition-color duration-300'>Decline</button>
          <button onClick={() => { rideActionHandler(true) }} className='h-9 w-[36%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Accept</button>
        </div>
      }
      {data.isAccepted === true && data.isCompleted === false &&
        <div className='flex gap-3 mt-3 mb-3'>
          <button onClick={() => { markRideAsComplete(true) }} className='h-9 w-[36%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Mark as complete</button>
        </div>
      }
    </div>
  )
}
