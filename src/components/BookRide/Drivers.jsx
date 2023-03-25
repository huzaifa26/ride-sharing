import React from 'react'
import DriverCard from './DriverCard'

export default function Drivers({data,location}) {
  return (
    <div>
      {data?.map((d)=>{
        return(
          <DriverCard driver={d} location={location}/>
        )
      })}
    </div>
  )
}