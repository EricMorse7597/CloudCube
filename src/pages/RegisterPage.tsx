import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setMessage("");
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, email },
        },
      });
  
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else if (data) {
        setMessage("Account Created! Check your email for a confirmation link.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred. Please try again.");
    }
  
    setUsername(""); 
    setEmail(""); 
    setPassword(""); 
  };
  

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center"}}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text" 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1.5px solid #ccc", borderRadius: "12px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1.5px solid #ccc", borderRadius: "12px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1.5px solid #ccc", borderRadius: "12px" }}
        />
        <button type="submit" style={{ width: "25%", padding: "8px", border: "1.5px solid #ccc", borderRadius: "12px", margin: "8px" }}>Register</button>
        <button style={{ width: "25%", padding: "8px", border: "1.5px solid #ccc", borderRadius: "12px", margin: "8px" }} type="submit" onClick={() => navigate("/login", { replace: true })}>Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}