import React, { useEffect, useState } from "react";
import axios from "../service/axiosInstance";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.js/index.js";
import CustomButton from "../components/Button.js/index.js";
import { decodeJwt } from "../utils/decodeJwt.js";

const ManageUsers = () => {
  const [users, setusers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  const {role} = decodeJwt();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/user/details");
      setusers(response.data.responseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await axios.delete("/user/delete", {
        data: { id: userToDelete },
      });
      console.log("User deleted:", response.data);

      fetchUsers();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteConfirmation = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="d-flex justify-content-between my-4">
          <h2>Manage Users</h2>
          <Link
            to={`/dashboard/userAddEdit?userId`}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
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
              ) : role === "admin" && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="table_row">
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>

                    <td className="actions">
                      <div className="d-flex justify-content-around">
                        <Link
                          to={`/dashboard/userAddEdit?userId=${user._id}`}
                          className="text-warning mr-3"
                          title="Edit"
                        >
                          <i className="bi bi-pencil mr-1"></i>
                        </Link>
                        <button
                          className="text-danger border-0 bg-transparent p-0"
                          onClick={() => openDeleteConfirmation(user._id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash mr-1"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // If users array is empty
                <tr>
                  <td colSpan="7" className="text-center">
                    {role === 'admin' ? "Data not found!" : "You dont have admin privilage to access!" } 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                  <p>Are you sure you want to delete this user?</p>
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
                    onClick={handleDeleteUser}
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

export default ManageUsers;
