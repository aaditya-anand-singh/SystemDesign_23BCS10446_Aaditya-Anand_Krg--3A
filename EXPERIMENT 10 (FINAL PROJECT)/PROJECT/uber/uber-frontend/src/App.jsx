import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const token = localStorage.getItem("token");

  // 🔐 If NOT logged in
  if (!token) {
    return showRegister
      ? <Register setShowRegister={setShowRegister} />
      : <Login setShowRegister={setShowRegister} />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    // ✅ ADMIN
    if (role === "ADMIN") {
      return <AdminDashboard />;
    }

    // ✅ DRIVER
    if (role === "DRIVER") {
      return <DriverDashboard />;
    }

    // ✅ USER
    return <Dashboard />;

  } catch (e) {
    localStorage.clear();
    return <Login setShowRegister={setShowRegister} />;
  }
}

export default App;