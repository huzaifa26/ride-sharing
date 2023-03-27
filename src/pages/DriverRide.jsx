import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import DriverRideCard from '../components/DriverRide/DriverRideCard';
import { API_URL } from '../components/Utils/const'

export default function DriverRide() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(queryClient.getQueryData(['user']));
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    try{
      const socket = io('http://localhost:5001');
      setSocket(socket);
  
      socket.emit('joinRideRoom', queryClient.getQueryData(['user'])?.id);
      setRoomId(queryClient.getQueryData(['user'])?.id);
  
      socket.on('rideRequest', (data) => {
        queryClient.invalidateQueries(["driver-rides"]);
      });
      console.log("connected")
    }catch(error){
      console.log(error);
    }
    

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, [queryClient.getQueryData(['user'])?.id]);

  const driverRideQuery = useQuery(["driver-rides"], fetchData);
  async function fetchData() {
    return axios.get(API_URL + "driver-rides/" + queryClient.getQueryData(['user']).id)
      .then((response) => {
        console.log(response.data);
        let newRides = []
        let activeRides = []
        response.data.forEach((d) => {
          if (d.isAccepted === null) {
            newRides.push(d);
          } else if (d.isAccepted === true) {
            activeRides.push(d);
          }
        })
        console.log({ newRides, activeRides })
        return { newRides, activeRides }
      })
      .catch((error) => {
        console.log(error);
        return []
      })
  }
  console.log(driverRideQuery.data);

  return (
    <>
      <div className='w-[86%] my-2 mb-10 m-auto space-y-4'>
        <h1 className='text-2xl font-[500]'>New Ride: </h1>
        {driverRideQuery.data?.newRides.length === 0 ? <p>No new rides at this moment.</p> : driverRideQuery.data?.newRides?.map((data) => {
          return <DriverRideCard data={data} />
        })}
      </div>
      <div className='w-[86%] mt-2 m-auto space-y-4'>
        <h1 className='text-2xl font-[500]'>Active Ride: </h1>
        {driverRideQuery.data?.activeRides.length === 0 ? <p>No new rides at this moment.</p> : driverRideQuery.data?.activeRides?.map((data) => {
          return <DriverRideCard data={data} />
        })}
      </div>
    </>
  )
}
