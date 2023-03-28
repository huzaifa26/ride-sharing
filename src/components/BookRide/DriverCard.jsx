import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import ChatModal from '../Chat/ChatModal';
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

  const cancelRideHandler = (accepted = false) => {
    let newData = {
      id: driver.DriverRides[0].id,
      isAccepted: accepted,
      acceptedBy: driver.id
    }
    cancelRideMutation.mutate(newData);
  }

  const [openChatModal, setOpenChatModal] = useState(false)
  const hideModal = () => setOpenChatModal(false);

  const conversationMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(API_URL + "conversation", data)
    },
    onSuccess: (res) => {
      console.log(res)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const conversationHandler = () => {
    let newDate = {
      parentId: queryClient.getQueryData(['user']).id,
      driverId: driver.id
    }
    conversationMutation.mutate(newDate);
  }

  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Connect to the server and create a Socket.IO instance
    const socket = io('http://localhost:5001');
    setSocket(socket);

    // Join the room with the user ID as the room ID
    socket.emit('joinRideRoom', queryClient.getQueryData(["user"])?.id);
    setRoomId(queryClient.getQueryData(["user"])?.id);

    // Handler for receiving rideRequestAccepted messages
    socket.on('message', (data) => {
      localStorage.setItem(driver.id, true);
      setShowNew(true);
    });

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, [queryClient.getQueryData(["user"])?.id]);

  const [showNew, setShowNew] = useState(localStorage.getItem(driver.id) === "true" ?true:false);

  return (
    <>
      {openChatModal && conversationMutation?.data && <ChatModal acceptedBy={driver.id} conversation={conversationMutation?.data?.data} hideModal={hideModal} />}
      <div className='w-[60%] min-h-48 shadow rounded-md p-2 min-w-[300px]'>
        <h1 className='text-lg'><span className='font-[500] text-lg'>Name: </span> {driver.fullName}</h1>
        <p className='text-md'><span className='font-[500] text-lg'>Email: </span> {driver.email}</p>
        <p className='text-md'><span className='font-[500] text-lg'>Phone Number: </span> {driver.phoneNumber}</p>
        <p className='text-md'><span className='font-[500] text-lg'>Car: </span>{driver.carName + " " + driver.carModel}</p>
        <p className='text-md'><span className='font-[500] text-lg'>Car registeration: </span> {driver.carRegisteration}</p>

        <div className='flex gap-2'>
          {driver.DriverRides.length === 0 &&
            <button onClick={() => bookRideHandler()} className='h-9 mt-2 w-[30%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Book</button>
          }
          {driver.DriverRides.length > 0 &&
            <button onClick={() => { cancelRideHandler() }} className='h-9 mt-2 w-[30%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Cancel Request</button>
          }
          {driver.DriverRides.length > 0 &&
            <button onClick={() => { conversationHandler(); setOpenChatModal(true); setShowNew(false); }} className='h-9 mt-2 w-[26%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Chat</button>
          }
          {showNew === true && <p>new message</p>}
        </div>
      </div>
    </>
  )
}