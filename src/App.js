import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<h1>Home</h1>} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

