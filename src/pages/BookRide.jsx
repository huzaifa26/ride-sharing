import React from 'react'
import SetLocation from '../components/BookRide/SetLocation'

export default function BookRide() {
  return (
    <div className='w-full min-h-[calc(100vh-64px)] px-[6%] flex'>
      <div className='w-[30%]'>
        <SetLocation />
      </div>
      <div className='w-[70%]'></div>
    </div>
  )
}
