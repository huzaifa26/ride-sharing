import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React from 'react'
import TableRow from '../components/History/TableRow';
import { API_URL } from '../components/Utils/const';

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const historyQuery = useQuery(["history"], fetchHistory);

  async function fetchHistory() {
    return axios.get(API_URL + "/history/" + queryClient.getQueryData(['user']).id +"/"+queryClient.getQueryData(['user']).userType)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className='xsm:w-[96%] sm:w-[96%] md:w-[86%] lg:w-[86%] xl:w-[86%] 2xl:w-[86%] m-auto overflow-auto'>
      <h1 className='text-xl font-[500] mt-4'>Ride history:</h1>
      {historyQuery?.isLoading ? <img className='w-[50px] m-auto mt-10' src='/BlackLoading.svg' /> :
        <table className="table-auto w-full mt-4 min-w-[900px]">
          <thead className='bg-[black] h-14'>
            <tr className='text-white text-left'>
              <th className='p-2 w-6'>#</th>
              <th className='p-2'>Name</th>
              <th className='p-2'>Email</th>
              <th className='p-2 w-60'>Pick up</th>
              <th className='p-2 w-60'>Drop off</th>
              <th className='p-2'>Phone</th>
              <th className='p-2 w-24'>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyQuery?.data?.map((data,index) => {
              return (
                <TableRow key={data.uid} data={data} index={index}/>
              )
            })}
          </tbody>
        </table>
      }
    </div>
  )
}
