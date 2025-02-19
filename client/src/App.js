import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import PrivateRoute from "./PrivateRoute";
import AuthProvider from "./config/AuthProvider";

import ResetPassword from "./pages/resetpassword";
import NotFound from "./pages/404";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<h1>Home</h1>} />
            <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path = "reset-password" element={<ResetPassword />} />

            <Route path="*" element={<NotFound/>} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

