import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Register from "./components/Auth/Register";
import Verify from "./components/Auth/Verify";
import Chat from "./components/Chat/Chat";
import Home from "./components/Home";
import Me from "./components/Me/Me";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/chat" element={<PrivateRoute element={<Me />} />} />
        <Route path="/me" element={<PrivateRoute element={<Chat />} />} />
      </Routes>
    </Router>
  );
};

export default App;
