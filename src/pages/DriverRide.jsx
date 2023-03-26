import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import DriverRideCard from '../components/DriverRide/DriverRideCard';
import { API_URL } from '../components/Utils/const'

export default function DriverRide() {
  const queryClient=useQueryClient();
  const driverRideQuery=useQuery(["driver-rides"],async ()=>{
    const user=queryClient.getQueryData(['user']);
    return axios.get(API_URL+"driver-rides/"+user.id)
    .then((response)=>{
      return response.data
    })
    .catch((error)=>{
      console.log(error);
      return []
    })
  })
  
  return (
    <div className='w-[86%] mt-2 m-auto space-y-4'>
      <h1 className='text-2xl font-[500]'>New Ride</h1>
      {driverRideQuery.data?.map((data)=>{
        return <DriverRideCard data={data}/>
      })}
    </div>
  )
}
