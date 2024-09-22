import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig'; // Ensure the correct path

function UserTripCard({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (trip) {
      GetPlaceImg();
    }
  }, [trip]);

  const GetPlaceImg = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location
      };
      const result = await GetPlaceDetails(data);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', result.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const tripDocRef = doc(db, 'AiTrips', trip.id);
      await deleteDoc(tripDocRef);

      if (onDelete) {
        onDelete(trip.id); // Notify parent component
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    }
  };

  return (
    <div className='relative bg-white bg-opacity-80 p-4 rounded-lg shadow-md'>
      <button
        onClick={handleDelete}
        className='absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200'
        aria-label="Delete Trip"
      >
        <span className='text-red-600 text-xl' role="img" aria-label="trash bin">🗑️</span>
      </button>
      <Link to={`/view-trip/${trip?.id}`}>
        <div className='hover:scale-105 transition-all hover:shadow-sm'>
          <img src={photoUrl} className='rounded-xl h-[200px] w-full object-cover mb-4' alt={`Image of ${trip?.userSelection?.location}`} />
          <div>
            <h2 className='font-medium text-lg text-gray-800'>{trip?.userSelection?.location}</h2>
            <h2 className="text-sm text-gray-600">
              {trip?.userSelection?.totalDays} Days trip with {trip?.userSelection?.budget}
            </h2>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default UserTripCard;
