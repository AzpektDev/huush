import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import "./../../assets/styles/Auth.css"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.status === 200) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", response.data.user.token);
        navigate("/verify");
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-label">
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="auth-input" />
        </label>
        <br />
        <label className="auth-label">
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" />
        </label>
        <br />
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;
