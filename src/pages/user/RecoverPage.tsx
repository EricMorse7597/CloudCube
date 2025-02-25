import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import "src/styles/index.css";


// two work flows: a component for send email from supabase servers and component for password reset after the user clicks on the password reset link 

export default function RecoverPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleRecoveryEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        try {

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
                setSuccessMessage("Check your email! We have sent a password reset to you");
            }

        } catch (err) {
            console.error("Unexpected error:", err);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }

        setUsername("");
        setEmail("");
        setPassword("");
    };

    const handleRecoveryPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        const updates: any = {};
        if (newPassword) {
            if (newPassword.length < 6) {
                setErrorMessage("Password needs to be at least 6 characters.");
                return;
            }
            if (newPassword !== confirmNewPassword) {
                setErrorMessage("New password and confirm password do not match.");
                return;
            } updates.password = newPassword;
        }

        try {


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
            <h1 className="title">Reset your Password</h1>
            <form onSubmit={handleRecoveryEmail}>
                <Grid
                    templateColumns="repeat(1, 1fr)"
                >
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

            <form onSubmit={handleRecoveryPassword}>
                <Grid
                    templateColumns="repeat(1, 1fr)"
                >

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
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}