import React, { useState } from "react";
import "./TrainBookingPage.css";

const TrainBookingPage = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
    classType: "Sleeper",
  });

  const [trainResults, setTrainResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchTrains = async () => {
    setLoading(true);
    try {
      // Example API endpoint (replace with a real train API like IRCTC or RapidAPI)
      const response = await fetch(
        `https://api.example.com/trains?from=${formData.from}&to=${formData.to}&date=${formData.date}`
      );
      const data = await response.json();
      setTrainResults(data.trains || []);
    } catch (error) {
      console.error("Error fetching train data:", error);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTrains();
  };

  return (
    <div className="train-booking-page colorful-background">
      <header className="header">
        <h1>Train Ticket Booking</h1>
        <p>Powered by API Integration</p>
      </header>

      <div className="tabs">
        <button className="tab active">Book Train Tickets</button>
        <button className="tab">Check PNR Status</button>
        <button className="tab">Live Train Status</button>
      </div>

      <div className="booking-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>From</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Enter departure city"
                required
              />
            </div>

            <div className="form-group">
              <label>To</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="Enter destination city"
                required
              />
            </div>

            <div className="form-group">
              <label>Travel Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Passengers</label>
              <input
                type="number"
                name="passengers"
                min="1"
                value={formData.passengers}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Class Type</label>
              <select name="classType" value={formData.classType} onChange={handleChange}>
                <option value="Sleeper">Sleeper</option>
                <option value="First AC">First AC</option>
                <option value="Second AC">Second AC</option>
                <option value="Third AC">Third AC</option>
              </select>
            </div>
          </div>

          <button type="submit" className="search-button">
            {loading ? "Searching..." : "Search Trains"}
          </button>
        </form>

        {trainResults.length > 0 && (
          <div className="train-results">
            <h2>Available Trains</h2>
            <ul>
              {trainResults.map((train, index) => (
                <li key={index} className="train-item">
                  <p><strong>Train:</strong> {train.name}</p>
                  <p><strong>Departure:</strong> {train.departureTime}</p>
                  <p><strong>Arrival:</strong> {train.arrivalTime}</p>
                  <p><strong>Class:</strong> {train.class}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainBookingPage;

