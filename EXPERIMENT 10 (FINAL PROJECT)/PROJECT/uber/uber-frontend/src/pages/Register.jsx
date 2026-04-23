import { useState } from "react";

function Register({ setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("Registered successfully ✅");
      setShowRegister(false); // back to login

    } catch (e) {
      alert("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>

      <div style={card}>
        <h2 style={{ textAlign: "center" }}>Register</h2>

        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role Dropdown */}
        <select
          style={input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="DRIVER">Driver</option>
        </select>

        <button
          style={button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Back to Login */}
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?
        </p>

        <button
          style={linkButton}
          onClick={() => setShowRegister(false)}
        >
          Back to Login
        </button>
      </div>

    </div>
  );
}

/* 🔥 Styles */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f6f8"
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "320px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const button = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  background: "#52c41a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const linkButton = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  background: "transparent",
  border: "none",
  color: "#1890ff",
  cursor: "pointer"
};

export default Register;