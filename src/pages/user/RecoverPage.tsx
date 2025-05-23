import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Header1, Header2, FormSection } from "src/styles/common";
import { Button, Flex } from "@chakra-ui/react";
import "src/styles/index.css";


// two work flows: 
// 1. component for send email to verify from supabase servers  
// 2. component for password reset after the user clicks on the password reset link 

export default function RecoverPage() {
    // const [email, setEmail] = useState("");
    const [identifier, setIdentifier] = useState<string>("");
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
    
        let userEmail = identifier;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
        try {
            if (!isEmail) {
                console.log("Looking up email for username:", identifier);
    
                // Fetch the email based on username from the profiles table
                const { data, error } = await supabase
                    .from("profiles")
                    .select("email")
                    .eq("username", identifier)
                    .limit(1)
                    .single();
    
                if (error || !data?.email) {
                    setErrorMessage("Username not found. Please enter a registered username.");
                    return; 
                }
                userEmail = data.email;
            }

            const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("email", userEmail)
            .limit(1)
            .single();

            if (profileError || !profileData?.email) {
                setErrorMessage("Email not found. Please enter a registered email.");
                return;
            }
    
            // Proceed with sending reset email since the email is valid
            const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
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
    
        setIdentifier("");
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
            <Header1 className="title">{isRecovery ? "Set a New Password" : "Reset your Password"}</Header1>

            {!isRecovery ? (
                <form onSubmit={handleRecoveryEmail}>
                    <Flex direction="column">
                        <Header2>We will send you an email to reset your password</Header2>
                        <FormSection>
                            <input
                                type="text"
                                placeholder="Username or Email"
                                className="input-style"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </FormSection>
                        <FormSection>
                            <Button type="submit" colorScheme="blue">Send Email</Button>
                        </FormSection>
                    </Flex>
                </form>
            ) : (
                <form onSubmit={handleRecoveryPassword}>
                    <Flex direction="column">
                        <FormSection>
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
                        </FormSection>
                        <FormSection>
                            <Button type="submit" colorScheme="blue">Update Password</Button>
                        </FormSection>
                    </Flex>
                </form>
            )}

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}