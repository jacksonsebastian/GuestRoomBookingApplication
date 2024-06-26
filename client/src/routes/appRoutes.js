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
import Dash from "../pages/dash";
import { Paths } from "./Paths";
import AuthGuard from "../guards/AuthGuard";
import DashTwo from "../pages/dashTwo";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={Paths.auth.login} />} />
        <Route element={<GuestGuard />}>
          <Route path={Paths.auth.login} element={<LoginForm />} />
          <Route path={Paths.auth.register} element={<RegisterForm />} />
        </Route>
        <Route element={<AuthGuard />}>
          <Route path={Paths.dashboard.root} element={<Dash />} />
          <Route path={Paths.dashboard.one} element={<Dash />} />
          <Route path={Paths.dashboard.two} element={<DashTwo />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
