import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Button } from "@chakra-ui/react";
import { useAuth } from "src/utils/AuthContext";
import "src/styles/index.css";
import Avatar from "src/components/User/Avatar"
import { Session } from '@supabase/supabase-js';

export default function ProfilePage({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPasswordField, setShowPasswordField] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function getProfile() {
        setLoading(true)
        const { user } = session
        const { data, error } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
        // add error checking
        if (data) {
            session.username = data.username;
            session.avatar_url = data.avatar_url;
        }
    }

    // calls getProfile on page load
    useEffect(() => {
        getProfile()
    })

    async function updateProfile({
        avatar_url,
    }: {
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: session.user?.id as string,
                username: session.username,
                email: session.user.email,
                avatar_url,
                // updated_at: new Date().toISOString(),
            })
            if (error) throw error
            alert('Profile Updated!')
        } catch (error) {
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!currentPassword) {
            setErrorMessage("Please enter your current password for verification.");
            return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            setErrorMessage("Error retrieving user. Please log in again.");
            return;
        }

        const email = userData.user.email;

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email!,
            password: currentPassword,
        });

        if (signInError) {
            setErrorMessage("Incorrect current password. Please try again.");
            return;
        }

        const updates: any = {};
        if (newEmail) updates.email = newEmail;
        if (newPassword) updates.password = newPassword;

        if (Object.keys(updates).length === 0) {
            setErrorMessage("Please enter a new email or password to update.");
            return;
        }

        const { error: updateError } = await supabase.auth.updateUser(updates);

        if (updateError) {
            setErrorMessage(`Error: ${updateError.message}`);
        } else {
            setSuccessMessage("Update successful! You will be logged out shortly.");
            setCurrentPassword("");
            setNewEmail("");
            setNewPassword("");

            setTimeout(async () => {
                logout();
                navigate("/login");
            }, 2500);
        }
    };

    // show current password confirm when user touches email/password update fields:

    const handleEmailChange = () => {
        setShowPasswordField(true);  // Show current password field when email is changing
    };

    const handlePasswordChange = () => {
        setShowPasswordField(true);  // Show current password field when password is changing
    };

    return (
        <div style={{ margin: "auto", padding: "3%" }}>
            <div className="element-style">
                <h2 style={{ fontWeight: "bold", textAlign: "center" }}>Profile</h2>
                <div className="profile" style={{ textAlign: "left", }}>
                    <div className="Avatar" style={{ display: "inline-block", verticalAlign: "middle" }}>
                        <Avatar
                            uid={session.user?.id ?? null}
                            url={session.avatar_url}
                            size={100}
                            onUpload={(url) => {
                                setAvatarUrl(url)
                                updateProfile({ avatar_url: url })
                            }}
                        />
                    </div>
                    <div className="Information" style={{ display: "inline-block", verticalAlign: "middle" }}>
                        <p>Username: {session.username}</p>
                        <p>Email: {session.user.email}</p>
                    </div>
                </div>
            </div>
            <hr style={{ margin: "20px" }}></hr>
            <h2 style={{ fontWeight: "bold", textAlign: "center" }}>User Account Settings</h2>
            <div className="element-style-update-account">
                <h2>Update Email Address</h2>
                <form onSubmit={handleUpdate}>

                    <input
                        type="email"
                        placeholder="New Email (Optional)"
                        value={newEmail}
                        className="input-style"
                        onChange={(e) => setNewEmail(e.target.value)}
                        onFocus={handleEmailChange}
                    />

                    <h2>Update Password</h2>
                    <input
                        type="password"
                        placeholder="New Password (Optional)"
                        value={newPassword}
                        className="input-style"
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={handlePasswordChange}
                    />


                    {showPasswordField && (
                        <div>
                            <input
                                type="password"
                                placeholder="Current Password (Required)"
                                value={currentPassword}
                                className="input-style"
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <Button float={"right"} type="submit" colorScheme="blue">Update Changes</Button>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>

    );
}