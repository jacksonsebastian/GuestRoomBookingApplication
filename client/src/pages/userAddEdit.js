import React, { useEffect, useState } from "react";
import axios from "../service/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Navbar from "../components/Navbar.js";

const UserAddEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("userId");

  const [showPopup, setShowPopup] = useState(false);

  // Define Yup schema for validation
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string()
      .oneOf(["user", "admin"], "Invalid role")
      .required("Role is required"),
    password: id ? null : Yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        if (id) {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token not found in localStorage");
            return;
          }

          const response = await axios.post("/user/detailById", { id });
          const fetchedRoom = response.data.responseData;
          // Set form values using setValue from react-hook-form
          setValue("name", fetchedRoom.name);
          setValue("email", fetchedRoom.email);
          setValue("phone", fetchedRoom.phone);
          setValue("role", fetchedRoom.role);
        } else {
          console.warn("Id is undefined or null");
        }
      } catch (error) {
        console.error("Error fetching room details by id:", error);
      }
    };

    fetchUserById();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const userData = { id, ...data };

      if (id) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        const response = await axios.put("/user/update", userData);
        console.log("User updated:", response.data);

        setShowPopup(true);
      } else {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        const response = await axios.post("/user/create", data);

        console.log("User created:", response.data);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>{id ? "Edit User Details" : "Add New User"}</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-3">
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Name:
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name")}
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email")}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Phone
              </label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                {...register("phone")}
              />
              <div className="invalid-feedback">{errors.phone?.message}</div>
            </div>
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Role
              </label>
              <select
                className={`form-control ${errors.role ? "is-invalid" : ""}`}
                {...register("role")}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="invalid-feedback">{errors.role?.message}</div>
            </div>
            {!id && (
              <div className="row mb-3">
                <div className="col-md-6 text-start">
                  <label className="mb-2" style={{ fontWeight: "bold" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    {...register("password")}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {id ? "Update User" : "Add User"}
          </button>
        </form>

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
                  <p>User {id ? "updated" : "created"} successfully!</p>
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
    </>
  );
};

export default UserAddEdit;
