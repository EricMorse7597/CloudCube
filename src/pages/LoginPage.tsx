import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
  buttonContainer:{
    display: "flex",
    justifyContent: "center",
    paddingTop: "5%",
    width: "fit-content",
    margin: "0 auto",
  }
};

const inputStyle: React.CSSProperties = { 
  width: "60%",
  padding: "0px 10px",
  margin: "4px 0",
  display: "inline-block",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

export default function LoginPage() {

  const [user, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(user);
    navigate("/");
    console.log("Logging in with", { email, password });
  };

  return (
    
    <div style={styles.container}>
      
      <form onSubmit={handleSubmit}>
      <div>
        <h2>Login</h2>
          <label style={{padding: "10px"}}>Username</label>
          <input
            type="username"
            style={inputStyle}
            value={user}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{padding: "10px"}}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{padding: "10px"}}>Password</label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
        </div>
        <div style={styles.buttonContainer}>
          <button style={{border:"1px solid #ccc", padding: "4px 10px"}}type="submit">Login</button>
        </div>
        
      </form>
    </div>
  );
}
