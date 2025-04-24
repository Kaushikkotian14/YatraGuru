import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (startDate && endDate) {
      const totalDays = calculateDaysBetweenDates(startDate, endDate);
      handleInputChange("totalDays", totalDays);
    }
  }, [startDate, endDate]);

  const calculateDaysBetweenDates = (start, end) => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include the end date
    return diffDays;
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (formData?.totalDays > 32 || !formData?.location || !formData?.budget || !formData?.traveler) {
      toast.error("Please fill all details!");
      return;
    }

    const totalDays = formData?.totalDays;
    toast.success("Form generated.");
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location)
      .replace("{totalDays}", totalDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      await SaveAiTrip(result?.response?.text());
    } catch (error) {
      toast.error("Failed to generate trip.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      navigate("/view-trip/" + docId);
    } catch (error) {
      toast.error("Failed to save trip data.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "Application/json",
        },
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      OnGenerateTrip();
    } catch (error) {
      console.log(error);
      toast.error("Failed to retrieve user profile.");
    }
  };

  return (
    <div className="relative px-5 mt-0 sm:px-10 md:px-32 lg:px-56 xl:px-72 min-h-screen overflow-hidden">
      {/* Background Video */}
      <video className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" autoPlay muted loop>
      <source src="/Hotel_bg.mp4" type="video/mp4" />  Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[-1]"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-grow">
          <h2 className="font-bold text-3xl text-white">Tell us your travel preferences 🌍✈️🌴</h2>
          <p className="mt-3 text-gray-200 text-xl">
            Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-10 relative z-10">
          <div className="mb-5">
            <label className="text-xl mb-3 font-medium text-white">What is your destination of choice?</label>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
              selectProps={{
                place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v.label);
                },
              }}
            />
          </div>

          <div className="mb-5">
            <label className="text-xl font-medium text-white">Select your travel start and end dates:</label>
            <div className="flex gap-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="bg-white text-black p-2 rounded"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="bg-white text-black p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-xl my-3 font-medium text-white">What is Your Budget?</label>
            <p className="text-gray-300">The budget is exclusively allocated for activities and dining purposes.</p>
            <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange("budget", item.title)}
                  className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${
                    formData?.budget === item.title ? "shadow-lg border-cyan-500" : ""
                  } bg-gray-800 text-white`}
                >
                  <h2 className="text-3xl">{item.icon}</h2>
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <h2 className="text-sm text-gray-400">{item.desc}</h2>
                </div>
              ))}
            </div>

            <label className="text-xl font-medium my-3 text-white">Who do you plan on traveling with on your next adventure?</label>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectTravelList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleInputChange("traveler", item.people)}
                  className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg ${
                    formData?.traveler === item.people ? "shadow-lg border-cyan-500" : ""
                  } bg-gray-800 text-white`}
                >
                  <h2 className="text-3xl">{item.icon}</h2>
                  <h2 className="text-lg font-bold">{item.title}</h2>
                 
                  {/* <h2 className="text-lg font-bold">{item.people}</h2> */}
                  <h2 className="text-sm text-gray-400">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
  {/* Other content above */}

  <div className="flex justify-end mt-auto mb-10">
    <Button
      className="bg-cyan-500 hover:bg-cyan-600 text-white"
      onClick={OnGenerateTrip}
    >
      {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Generate Trip"}
    </Button>
  </div>

  {/* Dialog and other components */}
</div>


          <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                {/* <img src="/logo.svg" alt="Logo" /> */}
                <h2 className="font-bold text-lg mt-6 text-white">Sign In with Google</h2>
                <p className="text-gray-200">Sign In to the App with Google authentication securely</p>
                <Button
                  onClick={login}
                  className="w-full mt-5 flex gap-4 items-center bg-cyan-500 text-white hover:bg-cyan-600">
                  <FcGoogle className="h-7 w-7" />
                  Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
