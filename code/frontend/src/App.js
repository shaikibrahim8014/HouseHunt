import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import { createContext, useEffect, useState } from "react";
import AdminHome from "./modules/admin/AdminHome";
import OwnerHome from "./modules/user/Owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";

export const UserContext = createContext();

function App() {
  const date = new Date().getFullYear();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setUserLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setUserLoggedIn(false);
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children, role }) => {
    if (!userLoggedIn) return <Navigate to="/login" replace />;
    if (role && userData && userData.type !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, userLoggedIn, setUserLoggedIn, handleLogout }}>
      <div className="App">
        <Router>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/adminhome"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ownerhome"
                element={
                  <ProtectedRoute role="Owner">
                    <OwnerHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/renterhome"
                element={
                  <ProtectedRoute role="Renter">
                    <RenterHome />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <footer className="bg-light text-center text-lg-start">
            <div className="text-center p-3">
              © {date} Copyright: HouseHunt
            </div>
          </footer>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;