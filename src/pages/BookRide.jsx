import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Drivers from '../components/BookRide/Drivers';
import SetLocation from '../components/BookRide/SetLocation'
import { API_URL } from '../components/Utils/const';
import io from 'socket.io-client';

export default function BookRide() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["user"])

  const activeRides = useQuery(["active-rides"], fetchActiveRides);
  const { isLoading, isError, data, error } = useQuery(["drivers"], fetchDrivers, { enable: false });

  const [location, setLocation] = useState({ pickup: null, dropoff: null });

  async function fetchDrivers() {
    return axios.get(API_URL + "drivers/" + queryClient.getQueryData(['user'])?.id)
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .then((data) => data);
  }

  async function fetchActiveRides() {
    return axios.get(API_URL + "active-rides/" + queryClient.getQueryData(["user"]).id)
      .then((response) => {
        return response.data
      })
      .then((data) => data);
  }

  const getLocations = (pickup, dropoff) => {
    setLocation({ pickup, dropoff });
    queryClient.invalidateQueries(["drivers"]);
  }

  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Connect to the server and create a Socket.IO instance
    const socket = io('http://localhost:5001');
    setSocket(socket);

    // Join the room with the user ID as the room ID
    socket.emit('joinRideRoom', user?.id);
    setRoomId(user?.id);

    // Handler for receiving rideRequestAccepted messages
    socket.on('rideRequestAccepted', (data) => {
      queryClient.invalidateQueries(["active-rides"]);
    });

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, [user?.id]);

  console.log(activeRides?.data);

  return (
    <>
      {
        activeRides.isLoading ?
          <img className='w-[70px] m-auto' src='/BlackLoading.svg' /> :
          activeRides?.data?.length !== 0 ?
            <div>active rides</div>
            :
            <div className='w-full min-h-[calc(100vh-64px)] px-[6%] flex gap-2'>
              <div className='w-[30%] mt-2'>
                <SetLocation getLocations={getLocations} />
              </div>
              {location.dropoff === null && location.pickup === null ? <p className='mt-4 ml-4'>Search Rides to see results</p> :
                <div className='w-[70%] p-4'>{<Drivers location={location} data={data} />}</div>
              }
            </div>
      }
    </>
  )
}
