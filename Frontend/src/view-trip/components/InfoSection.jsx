import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (trip && trip.userSelection?.location) {
      GetPlaceImg();
    }
  }, [trip]);

  const GetPlaceImg = async () => {
    const data = {
      textQuery: trip.userSelection.location
    };
    try {
      const result = await GetPlaceDetails(data);
      const photoUrl = PHOTO_REF_URL.replace('{NAME}', result.data.places[0].photos[3].name);
      setPhotoUrl(photoUrl);
    } catch (error) {
      console.error("Failed to fetch place image:", error);
    }
  };

  return (
    <div>
      {/* Display the image if available */}
      <img
        src={photoUrl ? photoUrl : '/public/road-trip-vacation.jpg'}
        className='h-[330px] w-full object-cover rounded-xl'
        alt="Destination"
      />
      <div className='flex justify-between items-center'>
        <div className='my-6 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location}</h2>
          <div className='flex gap-6 mt-4'>
            <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>
              🗓️ {trip?.userSelection?.totalDays} Day{trip?.userSelection?.totalDays > 1 ? 's' : ''}
            </h2>
            <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>
              👩‍👧‍👦 Number of Travelers: {trip?.userSelection?.traveler} People
            </h2>
            <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>
              💵 Budget: {trip?.userSelection?.budget}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
