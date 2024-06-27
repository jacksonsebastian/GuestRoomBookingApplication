import React, { useState, useEffect } from "react";
import axiosInstance from "../service/axiosInstance";

const imageUrls = [
  "/images/hotel-room.webp",
  "/images/hotel-room1.webp",
  "/images/hotel-room2.webp",
  "/images/hotel-room3.webp",
];

const RoomBooking = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endDateError, setEndDateError] = useState("");
  const [adultsError, setAdultsError] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    // Set the start date to the current date
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.post("/room/details");
      setRooms(
        response.data.rooms.map((room) => ({
          ...room,
          randomImage: imageUrls[Math.floor(Math.random() * imageUrls.length)], // Assign random image to each room
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearch = async () => {
    let formIsValid = true;

    // Validate adults count
    if (adults < 1) {
      setAdultsError("Adults must be at least 1");
      formIsValid = false;
    } else {
      setAdultsError("");
    }

    // Validate end date
    if (!endDate) {
      setEndDateError("End date is required");
      formIsValid = false;
    } else {
      setEndDateError("");
    }

    if (formIsValid) {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/room/details", {
          startDate,
          endDate,
        });
        setRooms(
          response.data.rooms.map((room) => ({
            ...room,
            randomImage:
              imageUrls[Math.floor(Math.random() * imageUrls.length)], // Assign random image to each room
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    } else {
      console.error("Form validation failed");
    }
  };

  return (
    <div className="container">
      <h3>Room Booking</h3>
      <div className="row mb-3 text-left">
        <div className="col-md-3">
          <label className="form-label">Check-in Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Check-out Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            min={startDate}
            max={
              startDate
                ? new Date(
                    new Date(startDate).getTime() + 30 * 24 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) => setEndDate(e.target.value)}
          />
          {endDateError && <div className="text-danger">{endDateError}</div>}
        </div>
        <div className="col-md-2">
          <label className="form-label">Adults</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
          {adultsError && <div className="text-danger">{adultsError}</div>}
        </div>
        <div className="col-md-2">
          <label className="form-label">Children</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end justify-content-start">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        rooms.map((room) => (
          <div
            key={room._id}
            className="row mb-3 roomBooking"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <div className="col-md-3">
              <div className="room-image-container">
                <img src={room.randomImage} alt="Room" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6 text-start">
              <h3>{room.name}</h3>
              <div className="row">
                <div className="col-md-6 text-start">
                  <div>
                    <p>Min Booking Period: {room.minBookingPeriod} days</p>
                    <p>Max Booking Period: {room.maxBookingPeriod} days</p>
                  </div>
                </div>
                <div className="col-md-6 text-start">
                  <div>
                    <p>No. of Beds: {room.numberOfBeds}</p>
                    <p>Amenities: {room.amenities.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 d-flex flex-column justify-content-between align-items-end">
              <div className="text-left">
                <p>Rent Per Day: Rs.{room.rentAmount} + GST Applied</p>
              </div>
              <div>
                <p>Status: {room.isBooked === 1 ? "Booked" : "Available"}</p>
                <button
                  className="roomBooking_btn"
                  disabled={room.isBooked === 1}
                  style={{
                    background: room.isBooked === 1 ? "gray" : "",
                    cursor: room.isBooked === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={() => console.log("Check:")}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomBooking;
