import { useState } from "react";
import { login } from "../services/api";

function Login({ setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful ✅");
        window.location.reload();
      } else {
        alert("Invalid credentials ❌");
      }

    } catch (e) {
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>

      <div style={card}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

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

        <button
          style={button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register switch */}
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?
        </p>

        <button
          style={linkButton}
          onClick={() => setShowRegister(true)}
        >
          Register here
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
  width: "300px"
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
  background: "#1890ff",
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

export default Login;