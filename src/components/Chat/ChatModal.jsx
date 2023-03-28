import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '../Utils/const';
import { AiOutlineSend } from 'react-icons/ai';
import moment from "moment-timezone";
import { toast } from 'react-toastify';
import io from 'socket.io-client';

export default function ChatModal({ hideModal, conversation, acceptedBy }) {
  const scrollRef = useRef();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const messageQuery = useQuery(['message'], fetchMessages, { enabled: false });

  async function fetchMessages() {
    console.log(conversation?.id);
    if (conversation?.id === undefined) {
      return []
    }
    return axios.get(API_URL + "message" + "/" + conversation?.id)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error);
        return []
      })
  }

  useEffect(() => {
    messageQuery.refetch();
  }, [conversation])

  const sendMesaageMutation = useMutation({
    mutationFn: async (newData) => {
      return axios.post(API_URL + "message", newData);
    },
    onSuccess: (res) => {
      toast.success("Message sent");
      queryClient.invalidateQueries(["message"]);
      messageQuery.refetch();
    },
    onError: () => {
      console.log(error)
    }
  })

  const sendMessageHandler = () => {
    if (message === null || message === "") {
      toast.error("Message cannot be empty");
      return
    }
    var newData = {
      conversationId: conversation.id,
      senderId: queryClient.getQueryData(['user']).id,
      content: message,
      acceptedBy: acceptedBy
    }
    sendMesaageMutation.mutate(newData);
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
      queryClient.invalidateQueries(["message"]);
      messageQuery.refetch();
    });

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId);
        socket.disconnect();
      }
    };
  }, [queryClient.getQueryData(["user"])?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageQuery.data])

  return (
    <div onClick={hideModal} className='w-[100%] !p-0 !m-0 h-[100vh] backdrop-blur-md bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 flex justify-center items-center'>
      <div onClick={(e) => { e.stopPropagation() }} className='w-[60%] h-[80%] bg-white rounded-md divide-y-2 flex flex-col'>
        <div className='w-full h-14 flex items-center'>
          <h2 className='p-2'>Chat</h2>
        </div>
        <div className='flex-1 flex flex-col w-full overflow-auto divide-y-2'>
          <div className='flex-1 '>
            {messageQuery.isLoading ? <img className='w-[50px] m-auto' src='/BlackLoading.svg' /> :
              <>
                {messageQuery?.data?.map((m) => {
                  console.log(m.senderId === queryClient.getQueryData(["user"]).id)
                  return (
                    <div key={m.id} style={m.senderId === queryClient.getQueryData(["user"]).id ? { alignItems: "end" } : {}} className={'flex flex-col'}>
                      <div className="flex max-w-[40%] bg-[aqua] px-4 py-2 rounded-md m-2 mb-0">
                        <p className="">{m.content}</p>
                      </div>
                      <p className="m-2 text-[12px] pl-4 mt-0">{moment(m.createdAt).fromNow()}</p>
                    </div>
                  )
                })}
              </>
            }
          </div>
          <div ref={scrollRef} className='relative w-full min-h-[60px]'>
            <input value={message} onChange={(e) => setMessage(e.target.value)} className='absolute place-self-end w-full p-2 pl-4 h-full  outline-none rounded-md' placeholder='Enter your message'></input>
            <AiOutlineSend onClick={() => { setMessage(""); sendMessageHandler(); }} className="w-[50px] absolute right-0 h-[50%] top-[50%] translate-y-[-50%] cursor-pointer" />
          </div>
          <div ref={scrollRef}></div>
        </div>
      </div>
    </div>
  )
}