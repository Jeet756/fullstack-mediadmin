import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";


import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import Features from "./components/Features";
import Join from "./components/Join";
import Pricing from "./components/Pricing";
import Doctors from "./components/Doctors";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/admin/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import PatientDashboard from "./components/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from "./components/Appointment";
import { HelmetProvider } from "react-helmet-async";

import Applications from "./components/admin/Applications";
import Appointments from "./components/admin/Appointments";
import Users from "./components/admin/Users";
import Posters from "./components/admin/Posters";
import Attendance from "./components/admin/Attendance";
import Register from "./components/admin/Register";
import ViewAttendance from "./components/admin/ViewAttendance";
import DoctorsAdmin from "./components/admin/DoctorsAdmin";
import GalleryAdmin from "./components/admin/GalleryAdmin";
import Gallery from "./components/Gallery";
import ContributorsAdmin from "./components/admin/ContributorsAdmin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "faq", element: <Faq /> },
      { path: "features", element: <Features /> },
      { path: "join", element: <Join /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "pricing", element: <Pricing /> },
      { path: "doctors", element: <Doctors /> },
      { path: "gallery", element: <Gallery /> },
      { path: "appointment", element: <Appointment /> },
      {
  path: "admin",
  element: (
    <ProtectedRoute allowedRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "applications",
      element: <Applications />
    },
    {
  path: "gallery",
  element: <GalleryAdmin />
},
{
  path: "contributors",
  element: <ContributorsAdmin />
},
    {
  path: "doctors",
  element: <DoctorsAdmin />
},
    {
      path: "appointments",
      element: <Appointments />
    },
    {
      path: "users",
      element: <Users />
    },
    {
      path: "posters",
      element: <Posters />
    },
    {
      path: "attendance",
      element: <Attendance />
    },
    {
      path: "register",
      element: <Register />
    },
    {
  path: "view-attendance",
  element: <ViewAttendance />
},
  ]
},
      {
        path: "staff",
        element: (
          <ProtectedRoute allowedRole="staff">
            <StaffDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient",
        element: (
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);
