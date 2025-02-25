import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import { useAuth } from "src/utils/AuthContext";
import "src/styles/index.css";
import Avatar from "src/components/User/Avatar"

export default function ProfilePage({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function getProfile() {
        setLoading(true)
        const { user } = session
        const { data, error } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
        // add error checking
        if (error) {
            alert('Error fetching user profile data: ' + error.message);
            return;
        }
        if (data) {
            setUsername(data.username);
            setAvatarUrl(data.avatar_url);
        }
        setLoading(false)
    }

    // calls getProfile on page load
    useEffect(() => {
        getProfile()
    }, []);

    async function updateProfile({
        avatar_url,
    }: {
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('profiles').upsert({
                id: session.user?.id as string,
                username: username,
                email: session.user.email,
                avatar_url,
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

        const email = session.user.email;

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

    return (
        !loading ?
            (
                <div style={{ margin: "auto", padding: "3%" }}>
                    <h2 style={{ fontWeight: "bold", textAlign: "center" }}>Profile</h2>
                    <div className="element-style">
                        <div className="profile" style={{ textAlign: "left", }}>
                            <div className="Avatar" style={{ display: "inline-block", verticalAlign: "top", margin: "0px 20px" }}>
                                <Avatar
                                    uid={session.user?.id ?? null}
                                    url={avatar_url}
                                    size={100}
                                    onUpload={(url) => {
                                        setAvatarUrl(url)
                                        updateProfile({ avatar_url: url })
                                    }}
                                />
                            </div>
                            <div className="Information" style={{ display: "inline-block", verticalAlign: "top" }}>
                                <p>Username: {username}</p>
                                <p>Email: {session.user.email}</p>
                            </div>
                        </div>
                    </div>
                    <hr style={{ margin: "20px" }}></hr>
                    <h2 style={{ fontWeight: "bold", textAlign: "center" }}>User Account Settings</h2>
                    <div className="element-style-update-account">
                        <form onSubmit={handleUpdate}>
                            <h3>Update Email Address</h3>
                            <input
                                type="email"
                                placeholder="New Email (Optional)"
                                value={newEmail}
                                className="input-style"
                                onChange={(e) => setNewEmail(e.target.value)}
                            />

                            <h3>Update Password</h3>
                            <input
                                type="password"
                                placeholder="New Password (Optional)"
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

                            <h3>Confirm Password</h3>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Old Password (Required)"
                                    value={currentPassword}
                                    className="input-style"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>

                            <Button float={"right"} type="submit" colorScheme="blue">Update Profile</Button>
                            {successMessage && <p className="success-message">{successMessage}</p>}
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </form>
                    </div>
                </div>)
            :
            (<h2 style={{ margin: "auto", textAlign: "center" }}>loading</h2>)
    );
}