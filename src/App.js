import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { saveUser } from "./redux/slice/authSlice";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import OutProtectedRoute from "./utils/OutProtectedRoute";
import InProtectedRoute from "./utils/InProtectedRoute";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export default function App() {
  initializeApp(firebaseConfig);
  const auth = getAuth();
  const user = useSelector((state) => state.auth.value);
  console.log("App user: ", user);
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(saveUser(user.refreshToken));
      } else {
        dispatch(saveUser(undefined));
      }
    });
  }, [auth, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<h1>Home</h1>} />
          <Route path="dashboard" element={<OutProtectedRoute element={<Dashboard />} />} />
          <Route path="login" element={<InProtectedRoute element={<Login />} />} />
          <Route path="register" element={<InProtectedRoute element={<Register />} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

