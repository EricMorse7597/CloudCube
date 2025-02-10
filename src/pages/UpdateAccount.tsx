import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupabaseClient";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../utils/AuthContext";
import "../styles/index.css";

export default function UpdateAccount() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showPasswordField, setShowPasswordField] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();


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
    <div style={{margin: "auto", padding: "3%"}}>
        <h2 style={{fontWeight: "bold"}}>User Account Settings</h2>
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