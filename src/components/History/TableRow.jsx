import React from 'react'

export default function TableRow({ data,index }) {
  return (
    <tr key={data.id} className="h-12 text-black" style={index % 2 !== 0 ? { backgroundColor: "#EEEEEE" } : {}}>
      <td className='p-2 font-[500]'>{index+1}</td>
      <td className='p-2'>{data?.driver?.fullName}</td>
      <td className='p-2'>{data?.driver?.email}</td>
      <td className='p-2'>{data?.pickup}</td>
      <td className='p-2'>{data?.dropoff}</td>
      <td className='p-2'>{data?.driver.phoneNumber}</td>
      <td className='p-2'>{!data?.isAccepted ?"Declined":data.isCompleted?"Completed":"Active"}</td>
    </tr>
  )
}
