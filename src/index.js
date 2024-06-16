import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import LoginPage from "./Login";
import SignupPage from "./Signup";
import { createTheme, ThemeProvider } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import StaffDashboardPage from "./StaffDashboard";
import PatientDashboardPage from "./PatientDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
  },
  {
    path: "/staff_dashboard",
    element: <StaffDashboardPage />,
  },
  {
    path: "/patient_dashboard",
    element: <PatientDashboardPage />,
  },
]);

const themeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e53935",
    },
    secondary: {
      main: "#f50057",
    },
  },
  shape: {
    borderRadius: 4,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={themeOptions}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
