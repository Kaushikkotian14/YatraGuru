import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Update to useNavigate
import { collection, query, where, getDocs } from "firebase/firestore";
import UserTripCard from './components/UserTripCard';
import { db } from '@/service/firebaseConfig';

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/');
            return;
        }
        setUserTrips([]); // Set an empty array before fetching
        const q = query(collection(db, 'AiTrips'), where('userEmail', '==', user?.email));
        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() }); // Include the document ID
        });
        setUserTrips(trips);
    };

    const handleCardClick = (trip) => {
        setSelectedTrip(trip);
    };

    const handleDelete = (tripId) => {
        setUserTrips((prev) => prev.filter(trip => trip.id !== tripId));
        // Optionally, you can refresh the list or notify the user
    };

    return (
        <div className='px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72'>
            <video className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" autoPlay muted loop>
                <source src="/my-trips.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <h2 className='font-bold text-3xl text-black'>My Trips</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-5 my-3'>
                {userTrips.length > 0 ? (
                    userTrips.map((trip, index) => (
                        <UserTripCard
                            key={index}
                            trip={trip}
                            onDelete={handleDelete} // Pass delete handler
                        />
                    ))
                ) : (
                    [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className='h-[200px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
                    ))
                )}
            </div>

            {selectedTrip && (
                <div className='mt-6 p-4 border border-gray-300 rounded-lg bg-white'>
                    <h2 className='font-bold text-xl mb-4'>Trip Details</h2>
                    <p><strong>Location:</strong> {selectedTrip.userSelection?.location}</p>
                    <p><strong>Total Days:</strong> {selectedTrip.userSelection?.totalDays}</p>
                    <p><strong>Budget:</strong> {selectedTrip.userSelection?.budget}</p>
                    <p><strong>Description:</strong> {selectedTrip.description || 'No description available.'}</p>
                </div>
            )}
        </div>
    );
}

export default MyTrips;
