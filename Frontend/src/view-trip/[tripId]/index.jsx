import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import TripPlace from '../components/TripPlace';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ✅ Format Prices to INR
const formatCurrencyINR = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const componentRef = useRef(); // Reference for screenshot

  // ✅ Fetch Trip Data from Firebase
  const GetTripData = async () => {
    if (!tripId) return;
    try {
      const docRef = doc(db, "AiTrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Trip Data:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
        toast.error('No trip found!');
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast.error("Error fetching trip data!");
    }
  };

  useEffect(() => {
    GetTripData();
  }, [tripId]);

  // ✅ Capture Screenshot & Generate Multi-Page PDF Correctly
  const handleScreenshotToPDF = () => {
    const input = componentRef.current;
    if (!input) {
      toast.error("Error: Unable to capture screenshot!");
      return;
    }

    toast.info("Capturing Data...");
    
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPos = 0; // Track y-axis for multiple pages

      while (yPos < imgHeight) {
        pdf.addImage(imgData, 'PNG', 0, -yPos, imgWidth, imgHeight);
        yPos += pageHeight; // Move to the next section
        if (yPos < imgHeight) pdf.addPage(); // Add new page if content exceeds one page
      }

      pdf.save(`Trip_${tripId}.pdf`);
      toast.success("PDF saved successfully!");
    }).catch((error) => {
      console.error("Screenshot to PDF error:", error);
      toast.error("Failed to generate PDF!");
    });
  };

  return (
    <div className="relative p-12 md:px-25 lg:px-44 xl:px-56 min-h-screen">
      {/* ✅ Background Video (Hidden in Screenshot) */}
      <video className="absolute top-0 left-0 w-full h-full object-cover z-[-1] print:hidden" autoPlay muted loop>
        <source src="/view-trip.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Content to Capture */}
      <div ref={componentRef} className="relative z-10 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Trip Details</h1>
        {trip ? (
          <>
            {/* ✅ Pass INR Formatting to Child Components */}
            <InfoSection trip={trip} formatCurrency={formatCurrencyINR} />
            <Hotels trip={trip} formatCurrency={formatCurrencyINR} />
            <TripPlace trip={trip} formatCurrency={formatCurrencyINR} />
          </>
        ) : (
          <p className="text-center text-gray-500">Loading trip details...</p>
        )}
      </div>

      {/* ✅ Screenshot to PDF Button */}
      <div className="fixed bottom-10 right-10">
        <button 
          onClick={handleScreenshotToPDF} 
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Save as PDF
        </button>
      </div>
    </div>
  );
}

export default ViewTrip;
