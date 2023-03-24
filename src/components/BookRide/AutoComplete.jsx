import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { API_URL } from '../Utils/const'

export default function AutoComplete({key,getValues}) {

  const [suggestion, setSuggestion] = useState([])
  const [pickup, setPickup] = useState(null);
  const inputRef=useRef()

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

  function handleClickOutside() {
    setSuggestion([]);
    setPickup(inputRef?.current?.value);
  };

  return (
    <div key={key} className='relative'>
      <input title={pickup} ref={inputRef} key={pickup} defaultValue={pickup} list="pickup" onChange={(e) => { getValues(e.target.value);getPlaces(e.target.value) }} className='z-20 w-full h-10 text-[16px] rounded-lg bg-[#EEEEEE] p-2' placeholder='Pickup location' />
      {suggestion.length > 0 && <div onClick={(e) => e.stopPropagation()} className='z-20 absolute w-[100%] bg-white overflow-hidden divide-y-2 border-2 border-[#EEEEEE] rounded-md'>
        {suggestion.map((s) => {
          return <option onClick={(e) => { setPickup(s.description);getValues(s.description) }} title={s.description} className='p-2 cursor-pointer' value={s.description}>{s.description}</option>
        })}
      </div>}
    </div>
  )
}