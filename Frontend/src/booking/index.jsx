import React from "react";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/booking.mp4" type="video/mp4" />
      </video>

      {/* Animated Heading */}
      <div
        style={{
          border: "4px solid white",
          padding: "20px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          animation: "popUp 1s ease-out",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white" }}>
          "Travel far enough, you meet yourself."
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.9, marginTop: "10px", color: "white" }}>
          Book your next journey with us and unlock endless possibilities.
        </p>
      </div>

      {/* Cards Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          maxWidth: "1200px",
          marginTop: "40px",
        }}
      >
        {[
          {
            name: "Hotels",
            img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=280&h=380&auto=compress&cs=tinysrgb",
          },
        ].map((category) => (
          <div
            key={category.name}
            onClick={() => navigate(`/${category.name.toLowerCase()}`)}
            style={{
              cursor: "pointer",
              width: "280px",
              height: "380px",
              borderRadius: "15px",
              overflow: "hidden",
              position: "relative",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            }}
          >
            <img
              src={category.img}
              alt={category.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />

            {/* Card Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                height: "35%",
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
                {category.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;