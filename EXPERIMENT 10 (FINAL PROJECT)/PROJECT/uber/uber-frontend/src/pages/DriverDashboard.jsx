import { useEffect, useState } from "react";
import {
  getAvailableRides,
  getDriverRides,
  acceptRide,
  completeRide,
} from "../services/api";

function DriverDashboard() {
  const [available, setAvailable] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const availableData = await getAvailableRides();
      const myRides = await getDriverRides();

      setAvailable(availableData);
      const active = myRides.find((r) => r.status === "ACCEPTED");
      setActiveRide(active || null);
    } catch (e) {
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      setProcessingId(id);
      await acceptRide(id);
      loadData();
    } catch {
      alert("You already have an active ride 🚫");
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (id) => {
    try {
      setProcessingId(id);
      await completeRide(id);
      loadData();
    } catch {
      alert("Error completing ride");
    } finally {
      setProcessingId(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={container}>
      {/* Header */}
      <div style={header}>
        <h2 style={{ margin: 0 }}>Driver Dashboard</h2>
        <button style={logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* ACTIVE RIDE */}
      {activeRide && (
        <>
          <h3 style={sectionTitle}>Active Ride</h3>
          <div style={{ ...card, borderLeft: "6px solid #52c41a" }}>
            <p><b>ID:</b> {activeRide.id}</p>
            <p>{activeRide.pickupLocation} → {activeRide.dropLocation}</p>
            <p>Status: <span style={badgeActive}>{activeRide.status}</span></p>

            <button
              style={primaryBtn}
              onClick={() => handleComplete(activeRide.id)}
              disabled={processingId === activeRide.id}
            >
              {processingId === activeRide.id ? "Processing..." : "Complete Ride"}
            </button>
          </div>
        </>
      )}

      {/* AVAILABLE RIDES */}
      <h3 style={sectionTitle}>Available Rides</h3>

      {loading ? (
        <p>Loading...</p>
      ) : available.length === 0 ? (
        <p>No rides available</p>
      ) : (
        available.map((r) => (
          <div key={r.id} style={card}>
            <p><b>ID:</b> {r.id}</p>
            <p>{r.pickupLocation} → {r.dropLocation}</p>

            <button
              style={primaryBtn}
              onClick={() => handleAccept(r.id)}
              disabled={processingId === r.id || activeRide}
            >
              {processingId === r.id ? "Processing..." : "Accept Ride"}
            </button>
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

const badgeActive = {
  background: "#52c41a",
  color: "white",
  padding: "2px 8px",
  borderRadius: "5px",
  fontSize: "12px"
};

export default DriverDashboard;