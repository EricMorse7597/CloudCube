import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Grid, GridItem } from "@chakra-ui/react";
import "src/styles/index.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredUsername, setRegisteredUsername] = useState("");
    const [loading, setLoading] = useState(false);
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
            // Check if email already exists
            const { data: emailData } = await supabase
                .from("profiles")
                .select("email")
                .eq("email", email)
                .single();
    
            if (emailData) {
                setErrorMessage("This email is already associated with an existing account.");
                return;
            }
    
            // Check if username already exists
            const { data: usernameData } = await supabase
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
                localStorage.setItem("registeredEmail", email); 
                localStorage.setItem("registeredUsername", username);
                setRegisteredUsername(username);
                setSuccessMessage(`Welcome, ${username}! Check your email for a confirmation link.`);
                setIsRegistered(true);
            }
    
        } catch (err) {
            console.error("Unexpected error:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    
        setUsername("");
        setPassword(""); // Keep email in state
    };

    const handleResendVerificationEmail = async () => {
        const storedEmail = localStorage.getItem("registeredEmail");
        
        if (!storedEmail) {
            setErrorMessage("Email is required to resend verification.");
            return;
        }
    
        setSuccessMessage("");
        setErrorMessage("");
        setLoading(true);
    
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: storedEmail,
        });
    
        setLoading(false);
    
        if (error) {
            console.error("Error resending verification email:", error.message);
            setErrorMessage(error.message || "Failed to resend verification email. Please try again later.");
        } else {
            setSuccessMessage("Verification email resent. Check your inbox!");
        }
    };

    const storedUsername = localStorage.getItem("registeredUsername");

    return (
        <div>
            {!isRegistered ? (
                <div className="element-style">
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <Grid templateColumns="repeat(1, 1fr)">
                        <GridItem>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="input-style"
                            />
                        </GridItem>
                        <GridItem>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-style"
                            />
                        </GridItem>
                        <GridItem>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-style"
                            />
                        </GridItem>
                        <GridItem>
                            <a href="/login" className="registerPrompt">Already have an account? Login here!</a>
                        </GridItem>
                        <GridItem>
                            <button type="submit" className="button-style">Register</button>
                        </GridItem>
                    </Grid>
                </form>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            ) : (
                <div className="element-style2">
                    <h2>Hello, {storedUsername}!</h2>
                    <p>Please check your email and verify your account before logging in.</p>
                    <p>If you didn't receive the email, click below to resend it.</p>
                    <button 
                        onClick={handleResendVerificationEmail} 
                        className="button-style" 
                        disabled={loading}
                    >
                        {loading ? "Resending..." : "Resend Verification Email"}
                    </button>
                    <button onClick={() => navigate("/login")} className="button-style">
                        Go to Login
                    </button>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            )}
        </div>
    );
}