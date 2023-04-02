import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import ChatModal from '../Chat/ChatModal';
import { API_URL, transformDate } from '../Utils/const';
import { colorsObj } from '../Utils/const';

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
      passengers:location.passengers,
      isCompleted: false,
      driverId: driver.id,
      parentId: user.id,
    }
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
      if(+data.senderId === +driver.id){
        localStorage.setItem(driver.id, true);
        setShowNew(true);
      }
    });

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, [queryClient.getQueryData(["user"])?.id]);

  const removeNewMessage=()=>{
    localStorage.removeItem(driver.id);
    setShowNew(false);
  }

  const [showNew, setShowNew] = useState(localStorage.getItem(driver.id) === "true" ? true : false);

  return (
    <>
      {openChatModal && conversationMutation?.data && <ChatModal removeNewMessage={removeNewMessage} acceptedBy={driver.id} conversation={conversationMutation?.data?.data} hideModal={hideModal} />}
      <div className='w-[60%] min-h-48 shadow rounded-md p-2 min-w-[300px]'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-[5px] my-2 '>
            <div style={{ background: colorsObj[driver.fullName[0].toLowerCase()] }} className='w-[50px] h-[50px] rounded-full text-white flex justify-center items-center text-xl font-[700]'>{driver.fullName[0]}</div>
            <div>
              <h1 className='text-lg font-[500]'>{driver.fullName}</h1>
              <p className='text-sm font-[400]'> {driver.email}</p>
            </div>
          </div>
          <div className='relative z-10'>
            {driver.DriverRides.length > 0 &&
              <button onClick={() => { conversationHandler(); setOpenChatModal(true); setShowNew(false); localStorage.removeItem(driver.id) }} className='relative h-9 mt-2 min-w-[80px] w-[6vw] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Chat</button>
            }
            {driver.DriverRides.length > 0 && showNew === true && <p className='absolute top-[10px] right-[1px] max-w-[10px] min-w-[10px] w-[10px] h-[10px] rounded-full max-h-[10px] min-h-[10px] bg-[#ff2626]'></p>}
          </div>

        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Phone Number </label>
          <p className='text-md'> {driver.phoneNumber}</p>
        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Car </label>
          <p className='text-md'>{driver.carName + " " + driver.carModel}</p>
        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Car registeration </label>
          <p className='text-md'> {driver.carRegisteration}</p>
        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Total Passengers </label>
          <p className='text-md'> {driver.totalPassenger}</p>
        </div>
        {driver.DriverRides.length > 0 &&
          <div className='my-2'>
            <label className='font-[600] text-[18px]'>Created Time</label>
            <p className='text-md'> {transformDate(driver?.DriverRides[0].createdAt)}</p>
          </div>
        }
        <div className='flex gap-2'>
          {driver.DriverRides.length === 0 &&
            <button onClick={() => bookRideHandler()} className='h-9 mt-2 w-[30%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Book</button>
          }
          {driver.DriverRides.length > 0 &&
            <button onClick={() => { cancelRideHandler() }} className='h-9 my-2 min-w-[150px] w-[10vw] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Cancel Request</button>
          }
        </div>
      </div>
    </>
  )
}