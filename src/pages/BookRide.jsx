import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Drivers from '../components/BookRide/Drivers';
import SetLocation from '../components/BookRide/SetLocation'
import { API_URL } from '../components/Utils/const';
import io from 'socket.io-client';


export default function BookRide() {
  const queryClient = useQueryClient();
  const { isLoading, isError, data, error } = useQuery(["drivers"], fetchDrivers, { enable: false });
  const [location, setLocation] = useState({})
  async function fetchDrivers() {
    return axios.get(API_URL + "drivers")
      .then((response) => {
        console.log(response.data)
        return response.data
      })
      .then((data) => data);
  }

  const getLocations = (pickup, dropoff) => {
    setLocation({ pickup, dropoff });
    queryClient.invalidateQueries(["drivers"]);
  }

  const user = queryClient.getQueryData(["user"])
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
      console.log("*****************************")
    });
    console.log("1111111111111111111")

    return () => {
      if (socket) {
        console.log("222222222222222222")
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, [user?.id]);

  return (
    <div className='w-full min-h-[calc(100vh-64px)] px-[6%] flex'>
      <div className='w-[30%]'>
        <SetLocation getLocations={getLocations} />
      </div>
      <div className='w-[70%] p-4'>{data?.length === 0 ? "Search Rides to see results" : <Drivers location={location} data={data} />}</div>
    </div>
  )
}
