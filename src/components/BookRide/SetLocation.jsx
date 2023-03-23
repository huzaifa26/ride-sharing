import React, { useEffect } from 'react'
import axios from 'axios';

export default function SetLocation() {

  const getGooglePlaces = (place) => {
    var url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + place + '&inputtype=textquery&key=AIzaSyAyo7SHKsH86GdRBd8QuEJV_1vAROC6sAo';

    axios.get(url)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    getGooglePlaces("abbottabad");
  }, [])

  return (
    <div className='m-2 h-72 w-full border-2 border-[#D7D7D7] rounded-lg p-2'>
      <h1 className='text-xl'>Book a ride</h1>
    </div>
  )
}
