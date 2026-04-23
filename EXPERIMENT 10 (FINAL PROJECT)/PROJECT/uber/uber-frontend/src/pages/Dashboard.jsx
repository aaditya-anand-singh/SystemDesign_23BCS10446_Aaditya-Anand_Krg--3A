import { useEffect, useState } from "react";
import { getMyRides, getAvailableRides, payRide } from "../services/api";
import CreateRide from "./CreateRide.jsx";

function Dashboard() {
  const [rides, setRides] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);

      if (payload.role === "USER") {
        loadUserRides();
      } else if (payload.role === "DRIVER") {
        loadAvailableRides();
      }
    } catch (error) {
      localStorage.clear();
      window.location.href = "/";
    }
  }, []);

  const loadUserRides = async () => {
    setLoading(true);
    const data = await getMyRides();
    setRides(data);
    setLoading(false);
  };

  const loadAvailableRides = async () => {
    setLoading(true);
    const data = await getAvailableRides();
    setRides(data);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handlePayment = async (id) => {
    try {
      setPayingId(id);
      await payRide(id);
      loadUserRides();
    } catch {
      alert("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <h2 style={{ margin: 0 }}>User Dashboard</h2>
        <button style={logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Create Ride */}
      <div style={{ marginTop: "10px" }}>
        {role === "USER" && <CreateRide />}
      </div>

      <h3 style={sectionTitle}>My Rides</h3>

      {loading ? (
        <p>Loading...</p>
      ) : rides.length === 0 ? (
        <p>No rides found</p>
      ) : (
        rides.map((r) => (
          <div key={r.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p><b>ID:</b> {r.id}</p>
              <span style={getStatusStyle(r.status)}>{r.status}</span>
            </div>

            <p style={{ color: "#555" }}>
              {r.pickupLocation} → {r.dropLocation}
            </p>

            {/* Pay button */}
            {role === "USER" && r.status === "COMPLETED" && (
              <button
                style={primaryBtn}
                onClick={() => handlePayment(r.id)}
                disabled={payingId === r.id}
              >
                {payingId === r.id ? "Processing..." : "Pay Now"}
              </button>
            )}

            {/* Paid badge */}
            {r.status === "PAID" && (
              <p style={{ color: "#52c41a", fontWeight: "bold" }}>
                Payment Done ✅
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* 🔥 Styles */

const container = {
  padding: "30px",
  background: "#f4f6f9",
  minHeight: "100vh",
  fontFamily: "Arial"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const logoutBtn = {
  padding: "8px 15px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const sectionTitle = {
  marginTop: "20px",
  color: "#333"
};

const card = {
  background: "#fff",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
};

const primaryBtn = {
  marginTop: "10px",
  padding: "8px 14px",
  background: "#1890ff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

/* 🎯 Status badge */
const getStatusStyle = (status) => {
  const base = {
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "white"
  };

  switch (status) {
    case "CREATED":
      return { ...base, background: "#faad14" };
    case "ACCEPTED":
      return { ...base, background: "#1890ff" };
    case "COMPLETED":
      return { ...base, background: "#52c41a" };
    case "PAID":
      return { ...base, background: "#722ed1" };
    default:
      return base;
  }
};

export default Dashboard;