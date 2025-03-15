import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "src/utils/SupabaseClient";
import { Button} from "@chakra-ui/react";
import { useAuth } from "src/utils/AuthContext";
import "src/styles/index.css";
import Avatar from "src/components/User/Avatar"
import UserSolveTable from "src/components/User/UserSolveTable";
import styled from "styled-components"
import {Header1, Header2, Divider, FormLabel, FormSection} from "src/styles/common"


const ProfileWrapper = styled.div`
    width: 100%;
    padding: 2rem;
    margin-bottom: 2rem;
`

const ProfileInfoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    gap: 1rem;
    text-align: left;
    padding: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`

const UserInfo = styled.p`
    font-size: 1rem;
    margin: 0.5rem;
    padding: 0;

    b {
        font-weight: bold;
        margin-right: 0.5rem;
    }
`;

export default function ProfilePage({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [entries, setEntries] = useState<any[]>([]); 

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function getProfile() {
        setLoading(true);
        
        const { user } = session;
        const { data, error } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", user.id)
            .maybeSingle(); 
    
        if (error) {
            alert("Error fetching user profile data: " + error.message);
            setLoading(false);
            return;
        }
    
        if (!data) {
            console.warn("No user profile found.");
            setLoading(false);
            return;
        }
    
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setLoading(false);
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
    
    async function fetchSolves() {
        const { data, error } = await supabase
            .from("solve")
            .select("scramble, solve_time, created_at")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching solves:", error.message);
            return;
        }

        if (data) {
            const formattedData = data.map((entry) => ({
                ...entry,
                created_at: new Date(entry.created_at).toLocaleString(),
            }));
            setEntries(formattedData); // Update state with fetched solves
        }
    }

    useEffect(() => {
        getProfile();
        fetchSolves(); 
    }, []);

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

            await supabase.auth.signOut();
            
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);

            setTimeout(() => {
                window.location.assign("/login");
            }, 2500);
        }
    };

    return (
        !loading ?
            (
                <ProfileWrapper>
                    <Header1 style={{ fontWeight: "bold", textAlign: "center" }}>Profile</Header1>
                        <ProfileInfoWrapper>
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
                                <UserInfo><b>Username:</b> {username}</UserInfo>
                                <UserInfo><b>Email:</b> {session.user.email}</UserInfo>
                            </div>
                        </ProfileInfoWrapper>

                    <Divider />

                    <Header2>Your Solve History</Header2>
                    <UserSolveTable solves={entries}/>

                    <br/><br/><br/>

                    <Header2>User Account Settings</Header2>
                    <div className="element-style-update-account">
                        <form onSubmit={handleUpdate}>
                            <FormSection>
                                <FormLabel>Update Email Address</FormLabel>
                                <input
                                    type="email"
                                    placeholder="New Email (Optional)"
                                    value={newEmail}
                                    className="input-style"
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </FormSection>
                            <FormSection>
                            <FormLabel>Update Password</FormLabel>


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
                            </FormSection>

                            <Divider />
                            <FormSection>
                            <FormLabel>Confirm Password</FormLabel>

                                <input
                                    type="password"
                                    placeholder="Old Password (Required)"
                                    value={currentPassword}
                                    className="input-style"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </FormSection>
                            <Button float={"right"} type="submit" colorScheme="blue">Update Profile</Button>
                            {successMessage && <p className="success-message">{successMessage}</p>}
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </form>
                    </div>
                </ProfileWrapper>)
            :
            (<h2 style={{ margin: "auto", textAlign: "center" }}>loading</h2>)
    );
}
