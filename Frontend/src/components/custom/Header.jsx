import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );
        };

        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    addGoogleTranslateScript();

    // Remove the Google icon using CSS and hide the iframe
    const removeGoogleIconCSS = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-gadget-icon {
          display: none;
        }
        .goog-te-gadget-simple {
          background-color: transparent;
          border: none;
          font-size: 14px;
          color: white;
        }
        .skiptranslate iframe {
          display: none;
        }
        /* Custom CSS for dropdown */
        #google_translate_element select {
          background-color: blue; /* White background */
          color: #1e40af; /* Blue text color */
          border: 1px solid #1e40af; /* Blue border */
          border-radius: 9999px; /* Full round corners */
          padding: 0.5rem 1rem; /* Padding */
          font-size: 0.875rem; /* Font size */
        }
        #google_translate_element select option {
          background-color: white; /* White background for options */
          color: #1e40af; /* Blue text color for options */
        }
        /* Adjusts the padding and appearance of the select dropdown */
        #google_translate_element .goog-te-menu-value {
          padding: 0.5rem 1rem;
          color: #1e40af; /* Blue text color */
        }
      `;
      document.head.appendChild(style);
    };

    removeGoogleIconCSS();
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json',
      },
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    });
  };

  return (
    <div className='relative p-3 shadow-sm flex justify-between items-center px-4 bg-gradient-to-r from-blue-500 to-purple-500'>
      
      {/* Background Video */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="header.mp4"
        autoPlay
        muted
        loop
      />

      {/* Overlay to darken background and enhance text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>

      <div className="relative z-20 flex justify-between items-center w-full">
        <img 
          src="/logo.jpg" 
          alt="Logo" 
          style={{ width: '120px', height: 'auto', borderRadius: '50%' }} 
          className="hover:scale-110 transition-transform duration-300 z-20"
        />

        <div className="flex items-center gap-6 z-20">
          {user && <div id="google_translate_element"></div>}
          
          {user ? 
            <div className='flex items-center gap-6'>
              <a href="/yatra-netra">
                <Button variant="outline" className="rounded-full bg-white text-blue-500 hover:bg-blue-100">Yatra Netra</Button> 
              </a>
              <a href="/yatra-sahayak">
                <Button variant="outline" className="rounded-full bg-white text-blue-500 hover:bg-blue-100">Yatra Sahayak</Button> 
              </a>
              <a href="/create-trip">
                <Button variant="outline" className="rounded-full bg-white text-blue-500 hover:bg-blue-100">Bookings</Button> 
              </a>
              <a href="/create-trip">
                <Button variant="outline" className="rounded-full bg-white text-blue-500 hover:bg-blue-100">Create Trip</Button> 
              </a>
              <a href="/my-trips">
                <Button variant="outline" className="rounded-full bg-white text-blue-500 hover:bg-blue-100">My Trips</Button> 
              </a>
              <Popover>
                <PopoverTrigger>
                  <img src={user?.picture} className='rounded-full w-[40px] h-[40px] hover:scale-110 transition-transform duration-300' />
                </PopoverTrigger>
                <PopoverContent className="bg-white text-blue-500 p-2 rounded-lg shadow-md">
                  <h2 className="cursor-pointer hover:text-red-500" onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}>Logout</h2>
                </PopoverContent>
              </Popover>
            </div>
            : <Button onClick={() => setOpenDialog(true)} className="bg-white text-blue-500 hover:bg-blue-100 rounded-full">Sign In</Button>
          }
        </div>
      </div>
      
      <Dialog open={openDialog}>
        <DialogContent className="rounded-lg shadow-lg p-4 bg-white">
          <DialogHeader>
            <DialogDescription className="flex flex-col items-center">
              <img src="/logo.jpg" className="w-20 h-20 rounded-full mb-4"/>
              <h2 className="font-bold text-lg mt-2 text-blue-500">Sign In with Google</h2>
              <p className="text-gray-500 mb-4">Sign in to the app with Google authentication securely</p>
              <Button 
                onClick={login} 
                className="w-full mt-3 flex gap-4 items-center bg-blue-500 text-white hover:bg-blue-600 rounded-full py-2 px-4">
                <FcGoogle className="h-7 w-7"/>
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
