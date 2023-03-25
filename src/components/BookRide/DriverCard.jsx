import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React from 'react'
import { API_URL } from '../Utils/const';

export default function DriverCard({driver,location}) {
  const queryClient=useQueryClient()
  const user=queryClient.getQueryData(['user']);

  const bookRideMutation=useMutation({
    mutationFn:async(data)=>{
      return axios.post(API_URL+"ride",data)
    },
    onSuccess:()=>{

    },
    onError:()=>{

    }
  })

  function bookRideHandler(){
    let data={
      pickup:location.pickup,
      dropoff:location.dropoff,
      isCompleted:false,
      driverId:driver.id,
      parentId:user.id,
    }
    console.log(data);
    bookRideMutation.mutate(data);
  }
  return (
    <div>
      <h1>{driver.fullName}</h1>
      <button onClick={()=>bookRideHandler()}>Book</button>
    </div>
  )
}