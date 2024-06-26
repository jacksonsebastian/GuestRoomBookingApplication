import React, { useState, useEffect } from "react";

const RoomBooking = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [endDateError, setEndDateError] = useState("");
  const [adultsError, setAdultsError] = useState("");

  useEffect(() => {
    // Set the start date to the current date
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
  }, []);

  const handleSearch = () => {
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
      console.log({
        startDate,
        endDate,
        adults,
        children,
      });
    } else {
      console.error("Form validation failed");
    }
  };

  return (
    <div className="container">
      <h3>Room Booking</h3>
      <div className="row mb-3 text-left">
        <div className="col-md-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">End Date</label>
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
        <div className="col-md-2 d-flex align-items-center justify-content-center">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div
        className="row mb-3 roomBooking"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
      >
        <div className="col-md-3">
          <img src="/1.jpg" alt="hey" />
        </div>

        <div className="col-md-6 text-start">
          <h3>Name</h3>
          <div className="row">
            <div className="col-md-6 text-start">
              <p>Location</p>
              <div>
                <p>Min Booking Period</p>
                <p>Max Booking Period</p>
              </div>
            </div>
            <div className="col-md-6 text-start">
              <div>
                <p>No. of Beds:</p>
                <p>Amenities:</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 d-flex flex-column justify-content-between align-items-end">
          <div className="">
            <p>Rent Amount: </p>
            <p>Rent Per Day: </p>
          </div>
          <div className="">
            <p>Status: </p>
            <button className="roomBooking_btn">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBooking;
