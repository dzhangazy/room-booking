import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import About from "./pages/About";
import Amenities from "./pages/Amenities";
import Contact from "./pages/Contact";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/rooms" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="container">
              <div className="card" style={{ padding: 28 }}>
                not found
              </div>
            </div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
