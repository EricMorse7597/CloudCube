import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { supabase } from "../utils/SupabaseClient";

const inputStyle: React.CSSProperties = { 
  width: "100%", padding: "10px", margin: "10px 0", border: "1.5px solid #ccc", borderRadius: "12px"
};

export default function LoginPage() {

  const [identifier, setIdentifier] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    let userEmail = identifier;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  
    try {
      if (!isEmail) {
        console.log("Looking up email for username:", identifier);
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", identifier)
          .limit(1)
          .single();
  
        if (error || !data?.email) {
          console.error("Failed to fetch email for username:", error || data);
          throw new Error("Invalid username or email.");
        }
        
        userEmail = data.email;
        console.log("Attempting login with:", userEmail, password);
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });
  
      if (error) {
        throw new Error(error.message);
      }
  
      login(data.user.id);
      navigate("/");
      console.log("Logged in as", data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center"}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Username or Email"
            style={inputStyle}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={{ width: "25%", padding: "8px", border: "1.5px solid #ccc", borderRadius: "12px", margin: "8px" }} type="submit">Login</button>
          <button style={{ width: "25%", padding: "8px", border: "1.5px solid #ccc", borderRadius: "12px", margin: "8px" }} type="submit" onClick={() => navigate("/register", { replace: true })}>Sign Up</button>
      </form>
    </div>
  );
}