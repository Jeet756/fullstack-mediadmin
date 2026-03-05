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
import AdminDashboard from "./components/AdminDashboard";
import Register from "./components/Register";
import StaffDashboard from "./components/StaffDashboard";
import PatientDashboard from "./components/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Appointment from "./components/Appointment";





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
      { path: "pricing", element: <Pricing /> },
      { path: "doctors", element: <Doctors /> },
      { path: "appointment", element: <Appointment /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <ProtectedRoute allowedRole="admin">
            <Register />
          </ProtectedRoute>
        ),
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
    <RouterProvider router={router} />
  </StrictMode>
);