import React from 'react';
import PlaceCardItem from './PlaceCardItem';
import { format } from 'date-fns';

function TripPlace({ trip }) {
  // Ensure that startDate and totalDays are valid
  const startDate = trip?.tripData?.startDate ? new Date(trip.tripData.startDate) : new Date();
  const totalDays = trip?.tripData?.totalDays || 0;

  // Function to get the date for a specific day
  const getDateForDay = (day) => {
    if (isNaN(startDate.getTime())) {
      // Return a placeholder or error message if the date is invalid
      return 'Invalid Date';
    }
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1); // Adjust date based on the day
    return format(date, 'dd MMM yyyy'); // Format as "Date Month Year"
  };

  return (
    <div className='my-4'>
      <h2 className='font-bold text-xl text-black-500'>Places to Visit</h2>
      <div>
        {trip?.tripData?.itinerary?.map((item, i) => (
          <div key={i} className='bg-white bg-opacity-70 p-4 rounded-lg shadow-md mb-6'>
            <h2 className='font-bold text-xl text-black-500'>{getDateForDay(item?.day)}</h2>
            <div className='grid md:grid-cols-2 gap-4'>
              {item.plan?.map((place, index) => (
                <PlaceCardItem key={index} place={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripPlace;
