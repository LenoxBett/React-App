import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if user is logged in (has token in localStorage)
  const isAuthenticated = localStorage.getItem("token");

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the children (protected component)
  return children;
};

export default PrivateRoute;