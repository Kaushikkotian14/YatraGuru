import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="hero.mp4"  
        autoPlay
        loop
        muted
      />
      
      {/* Overlay for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>

      {/* Overlay Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4 md:px-8">
        <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl mb-4">
          <span className='text-[#f56551]'>"AI-Powered Travel, Redefining Exploration"</span>
          <br />
          Discover Your Next Adventure with Yatra Guru
        </h1>
        <p className='text-xl md:text-2xl text-gray-200 mb-6'>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>
        <Link to={'/create-trip'}>
          <Button className="mt-6 bg-[#f56551] hover:bg-[#e53e3e] text-white px-6 py-3 rounded-lg shadow-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
