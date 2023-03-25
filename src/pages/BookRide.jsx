import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Drivers from '../components/BookRide/Drivers';
import SetLocation from '../components/BookRide/SetLocation'
import { API_URL } from '../components/Utils/const';

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
    console.log(pickup, dropoff);
    setLocation({ pickup, dropoff });
    queryClient.invalidateQueries(["drivers"]);
  }

  const [eventSource, setEventSource] = useState(null);
  const user = queryClient.getQueryData(["user"])

  useEffect(() => {
    try {
      const source = new EventSource(API_URL + 'ride-request-updates/' + user.id);
      // Listen for incoming SSE events and update the state
      source.onmessage = (event) => {
        console.log("11111111111111111111111111111111111")
        const data = JSON.parse(event.data);
        console.log(data);
      };
      setEventSource(source);
    } catch (e) {
      console.log(e)
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const handleAcceptRideRequest = (requestId) => {
    // Send a request to the backend to accept the ride request
    fetch('/accept-ride-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId,
        acceptedBy: userId
      })
    });
  };

  return (
    <div className='w-full min-h-[calc(100vh-64px)] px-[6%] flex'>
      <div className='w-[30%]'>
        <SetLocation getLocations={getLocations} />
      </div>
      <div className='w-[70%] p-4'>{data?.length === 0 ? "Search Rides to see results" : <Drivers location={location} data={data} />}</div>
    </div>
  )
}
