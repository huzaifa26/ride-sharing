import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import ChatModal from '../Chat/ChatModal';
import { API_URL } from '../Utils/const';
import { colorsObj } from '../Utils/const';
import { transformDate } from '../Utils/const';

export default function DriverRideCard({ data }) {
  const queryClient = useQueryClient();

  const rideActionMutation = useMutation({
    mutationFn: async (newData) => {
      return axios.put(API_URL + "ride-request-action", newData)
    },
    onSuccess: (res) => {
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

  const [openChatModal, setOpenChatModal] = useState(false)
  const hideModal = () => setOpenChatModal(false);

  const conversationMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(API_URL + "conversation", data)
    },
    onSuccess: (res) => {

    },
    onError: (error) => {
      console.log(error)
    }
  })

  const conversationHandler = () => {
    let newDate = {
      parentId: data.parent.id,
      driverId: queryClient.getQueryData(['user']).id
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
    socket.on('message', (res) => {
      if (+res.senderId === +data.parent.id) {
        localStorage.setItem(data.parent.id, true);
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

  const [showNew, setShowNew] = useState(localStorage.getItem(data.parent.id) === "true" ? true : false);

  const removeNewMessage = () => {
    localStorage.removeItem(data.parent.id);
    setShowNew(false);
  }

  return (
    <>
      {openChatModal && <ChatModal removeNewMessage={removeNewMessage} acceptedBy={data.parent.id} conversation={conversationMutation?.data?.data} hideModal={hideModal} />}
      <div className='w-[40%] min-h-48 xsm:min-w-[320px] min-w-[400px] shadow rounded-md p-2'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-[5px] my-2 '>
            <div style={{ background: colorsObj[data.parent.fullName[0].toLowerCase()] }} className='w-[50px] h-[50px] rounded-full text-white flex justify-center items-center text-xl font-[700]'>{data.parent.fullName[0]}</div>
            <div>
              <h1 className='text-lg font-[500]'>{data.parent.fullName}</h1>
              <p title={data.parent.email} className='text-sm font-[400] xsm:w-[150px] xsm:overflow-hidden'> {data.parent.email}</p>
            </div>
          </div>
          <div className='relative z-10'>
            <button onClick={() => { conversationHandler(); setOpenChatModal(true); setShowNew(false); localStorage.removeItem(data.parent.id) }} className='relative h-9 mt-2 min-w-[80px] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Chat</button>
            {showNew === true && <p className='absolute top-[10px] right-[1px] max-w-[10px] min-w-[10px] w-[10px] h-[10px] rounded-full max-h-[10px] min-h-[10px] bg-[#ff2626]'></p>}
          </div>
        </div>

        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Pick up</label>
          <p className='text-md'> {data.pickup}</p>
        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Drop off</label>
          <p className='text-md'> {data.dropoff}</p>
        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Passengers</label>
          <p className='text-md'> {data.passengers}</p>
        </div>
        <div className='my-2'>
          <label className='font-[600] text-[18px]'>Created Time</label>
          <p className='text-md'> {transformDate(data?.createdAt)}</p>
        </div>
        {data.isAccepted === null && data.isCompleted === false &&
          <div className='flex gap-3 mt-3 mb-3'>
            <button onClick={() => { rideActionHandler(false) }} className='h-9 w-[36%] border-2 border-black bg-white rounded-lg text-black font-bold hover:bg-[#D7D7D7] transition-color duration-300'>Decline</button>
            <button onClick={() => { rideActionHandler(true) }} className='h-9 w-[36%] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Accept</button>
          </div>
        }
        {data.isAccepted === true && data.isCompleted === false &&
          <div className='flex gap-3 mt-3 mb-3'>
            <button onClick={() => { markRideAsComplete(true) }} className='h-9 w-[160px] bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Mark as complete</button>
          </div>
        }
      </div>
    </>
  )
}
