import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "../../services/api";

const PrivateRoute = ({ element: Component }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await validateToken(token);
        if (response.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  return isValid ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
