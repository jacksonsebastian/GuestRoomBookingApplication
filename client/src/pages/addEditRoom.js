import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "../service/axiosInstance";
import { decodeJwt } from "../utils/decodeJwt";
import Navbar from "../components/Navbar.js";

const AddEditRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = decodeJwt();
  console.log("decodedToken:", userId);
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("roomId");

  const [showPopup, setShowPopup] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    floorSize: Yup.number().required("Floor size is required"),
    numberOfBeds: Yup.number().required("Number of beds is required"),
    minBookingPeriod: Yup.number().required("Min booking period is required"),
    maxBookingPeriod: Yup.number().required("Max booking period is required"),
    rentAmount: Yup.number().required("Rent amount is required"),
    amenities: Yup.string().required("Amenities is required"),
  });

  const defaultValues = {
    name: "",
    floorSize: null,
    numberOfBeds: null,
    minBookingPeriod: null,
    maxBookingPeriod: null,
    rentAmount: null,
    amenities: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        if (roomId) {
          const response = await axios.post("/room/detailById", { roomId });
          const fetchedRoom = response.data.room;
          // Set form values from data
          setValue("name", fetchedRoom.name);
          setValue("floorSize", fetchedRoom.floorSize);
          setValue("numberOfBeds", fetchedRoom.numberOfBeds);
          setValue("minBookingPeriod", fetchedRoom.minBookingPeriod);
          setValue("maxBookingPeriod", fetchedRoom.maxBookingPeriod);
          setValue("rentAmount", fetchedRoom.rentAmount);
          setValue("amenities", fetchedRoom.amenities.join(", "));
        } else {
          console.warn("roomId is undefined or null");
        }
      } catch (error) {
        console.error("Error fetching room details by id:", error);
      }
    };

    fetchRoomById();
  }, [roomId, setValue]);

  const onSubmit = async (data) => {
    try {
      const roomData = {
        ...data,
        amenities: data.amenities.split(",").map((item) => item.trim()),
        roomId: roomId ? roomId : undefined,
      };

      if (roomId) {
        const response = await axios.put(`/room/update`, { rooms: [roomData] });
        console.log("Room updated:", response.data);
      } else {
        const response = await axios.post(`/room/create`, {
          ownerId: userId ? userId : undefined,
          rooms: [roomData],
        });
        console.log("Room created:", response.data);
      }
      setShowPopup(true); // Show popup
    } catch (error) {
      console.error("Error submitting room:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/dashboard/manageRooms");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>{roomId ? "Edit Room Details" : "Add New Room"}</h1>
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
                Floor Size:
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.floorSize ? "is-invalid" : ""
                }`}
                {...register("floorSize")}
              />
              <div className="invalid-feedback">
                {errors.floorSize?.message}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Number of Beds:
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.numberOfBeds ? "is-invalid" : ""
                }`}
                {...register("numberOfBeds")}
              />
              <div className="invalid-feedback">
                {errors.numberOfBeds?.message}
              </div>
            </div>
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Min Booking Period:
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.minBookingPeriod ? "is-invalid" : ""
                }`}
                {...register("minBookingPeriod")}
              />
              <div className="invalid-feedback">
                {errors.minBookingPeriod?.message}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Max Booking Period:
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.maxBookingPeriod ? "is-invalid" : ""
                }`}
                {...register("maxBookingPeriod")}
              />
              <div className="invalid-feedback">
                {errors.maxBookingPeriod?.message}
              </div>
            </div>
            <div className="col-md-6 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Rent Amount:
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.rentAmount ? "is-invalid" : ""
                }`}
                {...register("rentAmount")}
              />
              <div className="invalid-feedback">
                {errors.rentAmount?.message}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12 text-start">
              <label className="mb-2" style={{ fontWeight: "bold" }}>
                Amenities (comma-separated):
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.amenities ? "is-invalid" : ""
                }`}
                {...register("amenities")}
              />
              <div className="invalid-feedback">
                {errors.amenities?.message}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            {roomId ? "Update Room" : "Add Room"}
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
                  <p>Room {roomId ? "updated" : "created"} successfully!</p>
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

export default AddEditRoom;
