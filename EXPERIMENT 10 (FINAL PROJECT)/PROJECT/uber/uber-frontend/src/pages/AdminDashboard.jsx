import { useEffect, useState } from "react";
import { getAllUsers, getAllRides, deleteUser } from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const u = await getAllUsers();
      const r = await getAllRides();
      setUsers(u);
      setRides(r);
    } catch {
      alert("Admin access required");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      loadData();
    } catch {
      alert("Cannot delete user");
    }
  };

  // 📊 stats
  const totalUsers = users.length;
  const totalRides = rides.length;
  const completed = rides.filter(r => r.status === "COMPLETED").length;
  const paid = rides.filter(r => r.status === "PAID").length;

  return (
    <div style={container}>

      {/* Header */}
      <div style={header}>
        <h2>Admin Dashboard</h2>
        <button style={logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* Stats */}
      <div style={statsGrid}>
        <Stat title="Users" value={totalUsers} />
        <Stat title="Rides" value={totalRides} />
        <Stat title="Completed" value={completed} />
        <Stat title="Paid" value={paid} />
      </div>

      {/* USERS */}
      <h3 style={sectionTitle}>Users</h3>
      <div style={grid}>
        {users.map((u) => (
          <div key={u.id} style={card}>
            <p><b>{u.email}</b></p>
            <span style={roleBadge(u.role)}>{u.role}</span>

            <button
              style={deleteBtn}
              onClick={() => handleDelete(u.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* RIDES */}
      <h3 style={sectionTitle}>All Rides</h3>
      <div style={grid}>
        {rides.map((r) => (
          <div key={r.id} style={card}>
            <p><b>ID:</b> {r.id}</p>
            <p>{r.pickupLocation} → {r.dropLocation}</p>
            <span style={statusBadge(r.status)}>{r.status}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

/* 🔥 Small reusable components */

const Stat = ({ title, value }) => (
  <div style={statCard}>
    <p style={{ margin: 0 }}>{title}</p>
    <h3 style={{ margin: 0 }}>{value}</h3>
  </div>
);

/* 🎨 Styles */

const container = {
  padding: "30px",
  background: "#f4f6f9",
  minHeight: "100vh",
  fontFamily: "Arial"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px"
};

const logoutBtn = {
  background: "#ff4d4f",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "15px"
};

const statCard = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const sectionTitle = {
  marginTop: "30px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px"
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
};

const deleteBtn = {
  marginTop: "10px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

/* 🎯 badges */

const roleBadge = (role) => ({
  display: "inline-block",
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  color: "white",
  background:
    role === "ADMIN" ? "#722ed1" :
    role === "DRIVER" ? "#1890ff" :
    "#52c41a"
});

const statusBadge = (status) => ({
  display: "inline-block",
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  color: "white",
  marginTop: "5px",
  background:
    status === "CREATED" ? "#faad14" :
    status === "ACCEPTED" ? "#1890ff" :
    status === "COMPLETED" ? "#52c41a" :
    "#722ed1"
});

export default AdminDashboard;