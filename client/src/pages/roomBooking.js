/* eslint-disable jsx-a11y/anchor-is-valid */
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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [endDateError, setEndDateError] = useState("");
  const [adultsError, setAdultsError] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [messaege, setMessage] = useState("");
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    // Set the start date to the current date
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.post("/room/details", {
        startDate,
        endDate,
        page,
        limit,
      });
      setRooms(
        response.data.rooms.map((room) => ({
          ...room,
          randomImage: imageUrls[Math.floor(Math.random() * imageUrls.length)], // Assign random image to each room
        }))
      );

      setTotalPages(Math.ceil(response.data.totalCount / limit));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setLoading(false);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page]);

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
          limit,
          page,
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

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleBooking = async (roomId) => {
    setBookingId(roomId);
    setBookingLoading(true);

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
      setBookingId("");
      setBookingLoading(false);
    } else {
      setEndDateError("");
    }

    if (formIsValid) {
      try {
        const response = await axiosInstance.post("/room/createBooking", {
          startDate,
          endDate,
          adults,
          children,
          roomId,
        });

        if (response.data.status === 1) {
          setBookingLoading(false);
          setShowPopup(true);
          setBookingId("");
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error("Error Booking:", error.message);
        setBookingLoading(false);
        setShowPopup(true);
        setBookingId("");
        setMessage(error.response.data.message);
      }
    }
  };
  console.log("totalPages:", totalPages, page);

  const closePopup = () => {
    setShowPopup(false);
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
            min={
              startDate
                ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
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
        <div class="text-center">
          <div class="spinner-border" role="status"></div>
        </div>
      ) : rooms.length > 0 ? (
        rooms.map((room) => (
          <div
            key={room._id}
            className="row mb-3 roomBooking"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <div className="col-md-3">
              <div className="room-image-container">
                <img
                  src={room.randomImage}
                  alt="Room"
                  className="img-fluid"
                  loading="lazy"
                />
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
                  onClick={() => handleBooking(room._id)}
                >
                  {bookingLoading && bookingId == room._id
                    ? "Loading..."
                    : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center">Data not found!</div>
      )}
      {rooms.length > 0 && (
        <div className="d-flex justify-content-end">
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item">
                <a
                  className="page-link"
                  aria-label="Next"
                  role="button"
                  disabled={page === 1}
                >
                  <span
                    aria-hidden="true"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    &laquo;
                  </span>
                </a>
              </li>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (data) => (
                  <li class={`page-item ${data === page ? "active" : ""}`}>
                    <a
                      className="page-link"
                      aria-label="Next"
                      role="button"
                      key={data}
                      onClick={() => handlePageChange(data)}
                    >
                      {data}
                    </a>
                  </li>
                )
              )}
              <li class="page-item">
                <a
                  className="page-link"
                  aria-label="Next"
                  role="button"
                  disabled={page === totalPages}
                >
                  <span
                    aria-hidden="true"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    &raquo;
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {showPopup && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Success!</h5>
              </div>
              <div className="modal-body">
                <p>{messaege}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closePopup}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomBooking;
