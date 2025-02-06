import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupabaseClient";
import "../styles/index.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();



  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setSuccessMessage(""); 
    setErrorMessage(""); 
  
    if (password.length < 6) {
      setErrorMessage("Password needs to be at least 6 characters.");
      return;
    }

    try {
      // check to see email already exists
      const { data: emailData, error: emailError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();

      if (emailData) {
        setErrorMessage("This email is already associated with an existing account.");
        return;
      }

      // check to see username already exists
      const { data: usernameData, error: usernameError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (usernameData) {
        setErrorMessage("Username already exists. Please choose a different one.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, email },
        },
      });

      if (error) {
        setErrorMessage("Sorry, couldn't register you at this time.");
      } else if (data) {
        setSuccessMessage("Account Created! Check your email for a confirmation link.");
      }

    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  
    setUsername(""); 
    setEmail(""); 
    setPassword(""); 
  };

  return (
    <div className="element-style">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text" 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-style"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-style"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-style"
        />
        <button type="submit" className="button-style">Register</button>
        <button className="button-style" type="submit" onClick={() => navigate("/login", { replace: true })}>Login</button>
        {/* {message || <p className="error-message">{message}</p>} */}
      </form>
      {/* <p>{message}</p> */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}