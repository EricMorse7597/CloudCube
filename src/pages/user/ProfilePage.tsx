

import { useEffect, useState } from "react";
import { supabase } from "src/utils/SupabaseClient";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, Grid, GridItem } from "@chakra-ui/react";
import { useAuth } from "src/utils/AuthContext";
import "src/styles/index.css";
import Avatar from "src/components/User/Avatar";
import UserSolveTable from "src/components/User/UserSolveTable";

export default function ProfilePage({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [entries, setEntries] = useState<any[]>([]);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [activeSection, setActiveSection] = useState<"dashboard" | "settings">("dashboard");
    const { logout } = useAuth();

    const { isOpen, onOpen, onClose } = useDisclosure();

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

    useEffect(() => {
        getProfile();
        fetchSolves();
    }, []);

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

    const clearSolveHistory = async () => {
        console.log("Deleting solve history for user:", session.user.id);
        const { error } = await supabase.from("solve").delete().eq("user_id", session.user.id);
    
        if (error) {
            console.error("Error deleting solve history:", error.message);
            return;
        }
    
        console.log("Solve history deleted successfully!");
        setEntries([]); // Clear UI table
        onClose(); // Close modal
    };

    function exportToCSV() {
        if (entries.length === 0) {
            alert("No data to export.");
            return;
        }
    
        // Ensure username is available
        const fileName = `solve_history_${username ?? "user"}.csv`;
    
        // defining CSV headers
        const headers = ["Scramble", "Solve Time", "Created At"];
    
        // converting array of objects to CSV string
        const csvRows = [
            headers.join(","), // Add headers
            ...entries.map(entry =>
                [entry.scramble, entry.solve_time, entry.created_at].join(",")
            )
        ].join("\n");
    
        const blob = new Blob([csvRows], { type: "text/csv" });
    
        // Create a link below
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const handleSettingsClick = () => {
        setActiveSection("settings");
    };
    
    const handleDashboardClick = () => {
        setActiveSection("dashboard");
    };
    


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
            }
            updates.password = newPassword;
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
                window.location.assign("/login");
            }, 2500);
        }
    };

    return (
        <Grid templateColumns="250px 1fr" gap={4} p={4}>
            <GridItem w="100%" p={4} borderRadius="md">
                <button 
                    onClick={handleDashboardClick} 
                    style={{ fontWeight: activeSection === "dashboard" ? "bold" : "normal" }}
                >
                    Dashboard
                </button>
                <br></br>
                <br></br>
                <button 
                    onClick={handleSettingsClick} 
                    style={{ fontWeight: activeSection === "settings" ? "bold" : "normal" }}
                >
                    Settings
                </button>
            </GridItem>

            <GridItem w="100%">
                {activeSection === "dashboard" && (
                    <div style={{ margin: "auto", padding: "3%" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>Your Solve History</h2>
                        <hr style={{ margin: "20px" }}></hr>
                        
                        <form 
                            style={{ 
                                margin: "auto", 
                                display: "flex", 
                                gap: "10px", /* Adds space between buttons */
                                justifyContent: "center", /* Centers buttons */
                                marginBottom: "5%" 
                            }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                exportToCSV();
                            }}
                        >
                            <Button type="submit" colorScheme="green">Export to CSV</Button>
                            <Button colorScheme="red" onClick={onOpen}>Clear Solves</Button>

                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Confirm Deletion</ModalHeader>
                                    <ModalBody>
                                        {entries.length === 0 ? (
                                            <p>No solve history to delete.</p>
                                        ) : (
                                            <p>Are you sure you want to delete all solve history? This action cannot be undone.</p>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                    {entries.length > 0 && (
                                        <>
                                            <Button colorScheme="red" onClick={clearSolveHistory} isLoading={loading}>
                                                Yes, Delete
                                            </Button>
                                            <Button onClick={onClose} ml={3} isDisabled={loading}>Cancel</Button>
                                        </>
                                    )}
                                    {entries.length === 0 && (
                                        <Button onClick={onClose} ml={3}>
                                            Close
                                        </Button>
                                    )}
                                </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </form>

                        <UserSolveTable solves={entries} />
                    </div>
                )}

                {activeSection === "settings" && (
                    <>
                        <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>Profile</h2>
                        <hr style={{ margin: "20px" }}></hr>
                        <h2 style={{ fontWeight: "bold", textAlign: "center" }}>User Account Settings</h2>
                        <div className="element-style-update-account">
                            <div className="element-style">
                                <div className="profile" style={{ textAlign: "left" }}>
                                    <div className="Avatar" style={{ display: "inline-block", verticalAlign: "top", margin: "0px 20px" }}>
                                        <Avatar
                                            uid={session.user?.id ?? null}
                                            url={avatar_url}
                                            size={100}
                                            onUpload={(url) => {
                                                setAvatarUrl(url);
                                            }}
                                        />
                                    </div>
                                    <div className="Information" style={{ display: "inline-block", verticalAlign: "top" }}>
                                        <p>Username: {username}</p>
                                        <p>Email: {session.user.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <form onSubmit={handleUpdate}>
                                <h3>Update Email Address</h3>
                                <input
                                    type="email"
                                    placeholder="New Email (Optional)"
                                    value={newEmail}
                                    className="input-style"
                                    onChange={(e) => setNewEmail(e.target.value)} />

                                <h3>Update Password</h3>
                                <input
                                    type="password"
                                    placeholder="New Password (Optional)"
                                    value={newPassword}
                                    className="input-style"
                                    onChange={(e) => setNewPassword(e.target.value)} />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmNewPassword}
                                    className="input-style"
                                    onChange={(e) => setConfirmNewPassword(e.target.value)} />

                                <h3>Confirm Password</h3>
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    className="input-style"
                                    onChange={(e) => setCurrentPassword(e.target.value)} />

                                <div className="container">
                                    <button type="submit" className="submit-button">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </GridItem>
        </Grid>
    );
}
