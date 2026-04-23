import { useState } from "react";
import { createRide } from "../services/api";

function CreateRide() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!pickup || !drop) {
      alert("Please enter both locations");
      return;
    }

    try {
      setLoading(true);

      await createRide({
        pickupLocation: pickup,
        dropLocation: drop,
      });

      alert("Ride created ✅");

      setPickup("");
      setDrop("");

      // optional refresh handled by parent normally
      window.location.reload();

    } catch (e) {
      alert("Error creating ride ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h3 style={{ marginBottom: "10px" }}>Create Ride</h3>

      <input
        style={input}
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />

      <input
        style={input}
        placeholder="Drop Location"
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
      />

      <button
        style={button}
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Ride"}
      </button>
    </div>
  );
}

/* 🔥 Styles */

const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  marginBottom: "20px"
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

export default CreateRide;