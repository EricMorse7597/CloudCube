import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { supabase } from "../utils/SupabaseClient";
import { useToast } from "@chakra-ui/react";
import "../styles/index.css";

export default function LoginPage() {

  // identifier is used for to id both email and username
  const [identifier, setIdentifier] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();

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
        // using the profiles table from db to see if we can match the information below 
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", identifier)
          .limit(1)
          .single();
  
        if (error || !data?.email) {
          //console.error("Failed to fetch email for username:", error || data);
          throw new Error("Account doesn’t exist.");
        }
  
        userEmail = data.email; // using the data of the user's session to find its email
        // console.log("Attempting login with:", userEmail, password);
      }
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });
  
      if (error) {
        if (error.message.includes("invalid_password")) {
          throw new Error("Wrong email or password.");
        }
        throw new Error("Unexpected error. Please try again later.");
      }
  
      login(data.user.id);
      navigate("/");
  
      toast({
        title: "Logged in successfully.",
        description: "You are logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
  
    } catch (err: any) {
      // a series of potential errors that could happen during a login session 
      let errorMessage = "Unexpected error.";
      if (err.message.includes("Account doesn’t exist")) {
        errorMessage = "Account doesn’t exist.";
      } else if (err.message.includes("Wrong email or password")) {
        errorMessage = "Wrong email or password.";
      } else if (err.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection.";
      }
  
      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    
    <div className="element-style">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Username or Email"
            className="input-style"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-style"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button className="button-style" type="submit">Login</button>
          <button className="button-style" type="submit" onClick={() => navigate("/register", { replace: true })}>Sign Up</button>
      </form>
    </div>
  );
}