import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import "src/styles/index.css";


// two work flows: 
// 1. component for send email to verify from supabase servers  
// 2. component for password reset after the user clicks on the password reset link 

export default function RecoverPage() {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isRecovery, setIsRecovery] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("type") === "recovery") {
            setIsRecovery(true);
        }
    }, []);

    const handleRecoveryEmail = async (e: React.FormEvent) => {
        e.preventDefault();
    
        setSuccessMessage("");
        setErrorMessage("");
    
        try {
            // checking to see if email exists in the profiles table first
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("email")
                .eq("email", email)
                .single();
    
            if (profileError || !profile) {
                setErrorMessage("Email not found. Please enter a registered email.");
                return;
            }
    
            // using the useEffect to reset the password  
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/recover?type=recovery`,
            });
    
            if (error) {
                setErrorMessage("Failed to send reset email. Please try again.");
            } else {
                setSuccessMessage("Check your email! We have sent a password reset link.");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    
        setEmail("");
    };
    
    

    const handleRecoveryPassword = async (e: React.FormEvent) => {

        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (newPassword.length < 6) {
            setErrorMessage("Password needs to be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("New password and confirm password do not match.");
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                setErrorMessage("Failed to update password. Please try again.");
            } else {
                setSuccessMessage("Password successfully updated! Redirecting to login...");
                await supabase.auth.signOut();
                
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 2000);
    
                setTimeout(() => {
                    window.location.assign("/login");
                }, 2500);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }

        setNewPassword("");
        setConfirmNewPassword("");
    };

    return (
        <div className="element-style">
            <h1 className="title">{isRecovery ? "Set a New Password" : "Reset your Password"}</h1>

            {!isRecovery ? (
                <form onSubmit={handleRecoveryEmail}>
                    <Grid templateColumns="repeat(1, 1fr)" gap={2}>
                        <p>We will send you an email to reset your password</p>
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
                            <Button type="submit" colorScheme="blue">Send Email</Button>
                        </GridItem>
                    </Grid>
                </form>
            ) : (
                <form onSubmit={handleRecoveryPassword}>
                    <Grid templateColumns="repeat(1, 1fr)">
                        <GridItem>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                className="input-style"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                className="input-style"
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </GridItem>
                        <GridItem>
                            <Button type="submit" colorScheme="blue">Update Password</Button>
                        </GridItem>
                    </Grid>
                </form>
            )}

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}