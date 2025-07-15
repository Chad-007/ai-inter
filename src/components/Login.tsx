import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      alert("Login failed: " + data.error);
    } else {
      alert("Login successful!");
      navigate("/interview");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          borderRadius: 12,
          padding: 48,
          width: 400,
          border: "1px solid #2a2a2a",
        }}
      >
        <h1 style={{ 
          textAlign: "center", 
          marginBottom: 32, 
          fontSize: 28, 
          fontWeight: 600, 
          color: "#00ff88",
          margin: "0 0 32px 0"
        }}>
          Sign In
        </h1>
        
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #333",
            fontSize: 16,
            background: "#111",
            color: "#fff",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = "#00ff88"}
          onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = "#333"}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 24,
            borderRadius: 8,
            border: "1px solid #333",
            fontSize: 16,
            background: "#111",
            color: "#fff",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = "#00ff88"}
          onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = "#333"}
        />
        
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#004d2a" : "#00ff88",
            color: "#000",
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.background = "#00cc6a")}
          onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.background = "#00ff88")}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Login;