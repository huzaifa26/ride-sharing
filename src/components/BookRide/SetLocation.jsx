import React, { useEffect, useId, useState } from 'react'
import axios from 'axios';
import { API_URL } from '../Utils/const';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import AutoComplete from './AutoComplete';

export default function SetLocation({ getLocations, location }) {
  const [pickup, setPickup] = useState(location.pickup || null);
  const [dropOff, setDropOFf] = useState(location.dropoff || null);

  const getpickup = (place) => {
    setPickup(place || null);
  }
  const getdropOff = (place) => {
    setDropOFf(place || null);
  }

  console.log(location)

  return (
    <div className='m-2 h-72 w-full border-2 border-[#D7D7D7] rounded-lg p-2'>
      <h1 className='text-xl'>Book a ride</h1>
      <div className='flex flex-col gap-4 mt-4'>
        <AutoComplete key={useId()} place={location.pickup} getValues={getpickup} />
        <AutoComplete key={useId()} place={location.dropoff} getValues={getdropOff} />
        <button onClick={() => getLocations(pickup, dropOff)} style={pickup === null || dropOff === null ? { cursor: "not-allowed", opacity: "0.5" } : {}} disabled={pickup === null || dropOff === null} className='h-10 w-full bg-black rounded-lg text-white font-bold hover:bg-[rgba(0,0,0,0.8)] transition-color duration-300'>Search</button>
      </div>
    </div>
  )
}