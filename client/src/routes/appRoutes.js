import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import GuestGuard from "../guards/GuestGuard";
import LoginForm from "../pages/auth/login";
import RegisterForm from "../pages/auth/register";
import { Paths } from "./Paths";
import AuthGuard from "../guards/AuthGuard";
import ManageRooms from "../pages/manageRooms";
import AddRoom from "../pages/addEditRoom";
import RoomBooking from "../pages/roomBooking";
import ManageUsers from "../pages/manageUsers";
import UserAddEdit from "../pages/userAddEdit";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={Paths.auth.login} />} />       
        <Route path={Paths.rooms.bookRoom} element={<RoomBooking />} />
        <Route element={<GuestGuard />}>
          <Route path={Paths.auth.login} element={<LoginForm />} />
          <Route path={Paths.auth.register} element={<RegisterForm />} />
        </Route>
        <Route element={<AuthGuard />}>
          <Route path={Paths.dashboard.root} element={<ManageUsers />} />
          <Route path={Paths.dashboard.dashboard} element={<ManageUsers />} />
          <Route path={Paths.dashboard.userAddEdit} element={<UserAddEdit />} />
          <Route path={Paths.dashboard.manageRooms} element={<ManageRooms />} />
          <Route path={Paths.dashboard.addEditRooms} element={<AddRoom />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
