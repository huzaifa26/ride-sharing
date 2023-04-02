import React from 'react'

export default function TableRow({ data,index }) {
  console.log(data);
  return (
    <tr key={data.id} className="h-12 text-black" style={index % 2 !== 0 ? { backgroundColor: "#EEEEEE" } : {}}>
      <td className='p-2 font-[500]'>{index+1}</td>
      <td className='p-2'>{data?.driver?.fullName || data?.parent?.fullName}</td>
      <td className='p-2'>{data?.driver?.email || data?.parent?.email}</td>
      <td className='p-2'>{data?.pickup}</td>
      <td className='p-2'>{data?.dropoff}</td>
      <td className='p-2'>{data?.driver?.phoneNumber || data?.parent?.phoneNumber}</td>
      <td className='p-2'>{!data?.isAccepted ?"Declined":data?.isCompleted?"Completed":"Active"}</td>
    </tr>
  )
}
