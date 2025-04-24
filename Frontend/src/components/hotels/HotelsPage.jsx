import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function HotelSearch() {
  const [formData, setFormData] = useState({
    location: "",
    checkin: "",
    checkout: "",
    guests: 1,
    pageNumber: 1,
    sort: "popularity",
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/hotel_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const rawData = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(rawData);
      } catch (error) {
        throw new Error("Invalid JSON response from API");
      }

      if (parsedData?.data?.data && Array.isArray(parsedData.data.data)) {
        let sortedHotels = parsedData.data.data.sort((a, b) => {
          const priceA = parseFloat(a.priceForDisplay?.replace(/[^0-9.]/g, "")) || Infinity;
          const priceB = parseFloat(b.priceForDisplay?.replace(/[^0-9.]/g, "")) || Infinity;
          return priceA - priceB;
        });
        setHotels(sortedHotels);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch hotel data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex flex-col items-center py-10 text-white relative">
      {/* Background Video */}
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/Hotel_bg.mp4" type="video/mp4" />
      </video>

      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-5 z-10">
        Hotel Search
      </motion.h2>
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-gray-800 z-10"
      >
        <div className="flex items-center border-b-2 py-2 mb-4">
          <FaSearch className="text-gray-500 mr-2" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="w-full outline-none" />
        </div>
        <input type="date" name="checkin" value={formData.checkin} onChange={handleChange} required className="w-full mb-3 p-2 rounded" />
        <input type="date" name="checkout" value={formData.checkout} onChange={handleChange} required className="w-full mb-3 p-2 rounded" />
        <input type="number" name="guests" min="1" value={formData.guests} onChange={handleChange} required className="w-full mb-3 p-2 rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300">
          {loading ? "Searching..." : "Search Hotels"}
        </button>
      </motion.form>
      {error && <p className="text-red-500 mt-3 z-10">{error}</p>}
      <div className="mt-8 w-full max-w-5xl z-10">
        <h3 className="text-2xl font-semibold mb-4">Results:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.length > 0 ? hotels.map((hotel) => <HotelCard key={hotel.title} hotel={hotel} />) : <p>No results found</p>}
        </div>
      </div>
    </div>
  );
}

function HotelCard({ hotel }) {
  const priceInINR = hotel.priceForDisplay ? `₹${(parseFloat(hotel.priceForDisplay.replace(/[^0-9.]/g, "")) * 83).toFixed(0)}` : "N/A";
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} className="bg-white text-gray-800 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative z-10">
      {hotel.bubbleRating?.rating >= 4.5 && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Recommended</span>}
      <img src={hotel?.cardPhotos[0]?.sizes?.urlTemplate?.replace("{width}", "400").replace("{height}", "300")} alt={hotel.title || "Hotel Image"} className="w-full rounded-lg mb-3 cursor-pointer" />
      <h3 className="text-lg font-bold">{hotel.title.replace(/\d+\.\s*/, "")}</h3>
      <p className="text-gray-600">{hotel.secondaryInfo}</p>
      <p className="font-semibold">Price: {priceInINR}</p>
      <p className="flex items-center">Rating: {renderStars(hotel.bubbleRating?.rating || 0)}</p>
      <a href={hotel.commerceInfo?.externalUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
        View Details
      </a>
    </motion.div>
  );
}
