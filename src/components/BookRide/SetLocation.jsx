import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL } from '../Utils/const';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

export default function SetLocation() {
  const [suggestion, setSuggestion] = useState([])
  const [pickup,setPickup]=useState(null)
  const [dropOff,setDropOff]=useState(null)

  const getPlaces = (place) => {
    axios.get(API_URL + "/places/" + place)
      .then((res) => {
        setSuggestion(res.data.predictions)
      }).catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleClickOutside(){
    setSuggestion([]);
  }

  return (
    <div className='m-2 h-72 w-full border-2 border-[#D7D7D7] rounded-lg p-2'>
      <h1 className='text-xl'>Book a ride</h1>
      <div className='flex flex-col gap-4 mt-4'>
        <div className='relative'>
          <input key={pickup} defaultValue={pickup} list="pickup" onChange={(e) => { getPlaces(e.target.value) }} className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' placeholder='Pickup location' />
          {suggestion.length > 0 && <div onClick={(e)=>e.stopPropagation()} className='absolute w-[100%] bg-white overflow-hidden divide-y-2 border-2 border-[#EEEEEE] rounded-md'>
            {suggestion.map((s) => {
              return <option onClick={(e)=>{console.log(s.description);setPickup(s.description)}} title={s.description} className='p-2 cursor-pointer' value={s.description}>{s.description}</option>
            })}
          </div>}
        </div>

        <input className='w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' placeholder='Dropoff location' />
      </div>
    </div>
  )
}
