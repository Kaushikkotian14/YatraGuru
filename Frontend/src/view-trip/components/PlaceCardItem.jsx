import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        place && GetPlaceImg();
    }, [place]);

    const GetPlaceImg = async () => {
        const data = {
            textQuery: place?.placeName
        };
        await GetPlaceDetails(data).then(resp => {
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0]?.photos[3]?.name || '');
            setPhotoUrl(PhotoUrl);
        });
    };

    // ✅ Function to format price correctly
    const formatPrice = (price) => {
        if (!price || typeof price !== 'string') return "Free of Cost"; // If price is missing, show "Free of Cost"

        const priceNumbers = price.match(/\d+/g); // Extract numeric values
        if (!priceNumbers) return "Free of Cost"; // No valid number found

        return `₹${parseInt(priceNumbers[0]).toLocaleString('en-IN')}`; // Convert first valid number
    };

    return (
        <div>
            <Link to={`https://www.google.com/maps/search/?api=1&query=${place?.placeName},${place?.geoCoordinates}`} target='_blank'>
                <div className='my-4 bg-gray-50 p-2 gap-2 border rounded-lg flex flex-cols-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer '>
                    <div className='py-2 mx-3'>
                        <img src={photoUrl || '/public/road-trip-vacation.jpg'} className='w-[140px] h-[140px] rounded-xl object-cover' />
                    </div>
                    <div>
                        <h2 className='font-medium text-sm text-orange-600'>{place?.time}</h2>
                        <h2 className='font-bold'>{place?.placeName}</h2>
                        <p className='text-sm text-gray-500'>{place?.placeDetails}</p>
                        <h2 className='text-blue-700 text-sm'>💰 {formatPrice(place?.ticketPricing)}</h2>
                        <h2 className='text-sm text-yellow-500'>⭐ {place?.rating}</h2>
                    </div>
                    <div className='mt-36'>
                        <Button><FaLocationDot /></Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PlaceCardItem;
