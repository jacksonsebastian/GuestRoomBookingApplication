/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import axios from "../service/axiosInstance";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.js/index.js";
import CustomButton from "../components/Button.js/index.js";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRooms = async () => {
    try {
      const response = await axios.post("/room/details", {
        startDate: "",
        endDate: "",
        page,
        limit,
      });
      setRooms(response.data.rooms);
      setLoading(false); // Set loading to false after data is fetched
      setTotalPages(Math.ceil(response.data.totalCount / limit));
    } catch (error) {
      console.error("Error fetching room details:", error);
      setLoading(false); // Set loading to false on error as well
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page]);

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      const response = await axios.delete("/room/delete", {
        data: { roomId: roomToDelete },
      });
      console.log("Room deleted:", response.data);

      fetchRooms();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const openDeleteConfirmation = (roomId) => {
    setRoomToDelete(roomId);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setRoomToDelete(null);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="d-flex justify-content-between my-4">
          <h2>Manage Rooms</h2>
          <Link
            to={`/dashboard/addEditRooms?roomId`}
            className="text-primary mr-3"
            title="Create"
          >
            <CustomButton text="Create" />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Room Name</th>
                <th>Rent Amount</th>
                <th>Max Booking Period</th>
                <th>Min Booking Period</th>
                <th>Number of Beds</th>
                <th>Floor Size</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? ( // Show skeleton loader if loading is true
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                    <td>
                      <div className="skeleton-line"></div>
                    </td>
                  </tr>
                ))
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room.name}</td>
                    <td>{room.rentAmount}</td>
                    <td>{room.maxBookingPeriod}</td>
                    <td>{room.minBookingPeriod}</td>
                    <td>{room.numberOfBeds}</td>
                    <td>{room.isBooked ? "Booked" : "Available"}</td>
                    <td>{room.floorSize}</td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/dashboard/addEditRooms?roomId=${room._id}`}
                          className="text-warning mr-3"
                          title="Edit"
                        >
                          <i className="bi bi-pencil mr-1"></i>
                        </Link>
                        <button
                          className="text-danger border-0 bg-transparent p-0"
                          onClick={() => openDeleteConfirmation(room._id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash mr-1"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Data not found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                        role="button"
                        disabled={page === 1}
                        aria-hidden="true"
                        onClick={() => handlePageChange(page - 1)}
                      >
                        &laquo;
                      </span>
                    </a>
                  </li>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((data) => (
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
                  ))}
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
                        disabled={page === totalPages}
                      >
                        &raquo;
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showDeleteConfirmation && (
          <div
            className="modal show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={closeDeleteConfirmation}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this room?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDeleteConfirmation}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteRoom}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageRooms;
