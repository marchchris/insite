import { useContext } from "react";
import { AuthContext } from "./config/AuthProvider";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import VerifyEmail from "./pages/verifyEmail";

import Loading from "./components/loadingScreen";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    if (!user.emailVerified) {
      return <VerifyEmail />;
    }
    return children;
  }

  return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;