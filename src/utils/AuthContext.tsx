import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../utils/SupabaseClient";
import { useToast } from "@chakra-ui/react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const toast = useToast();

  // Monitor the user's session
  useEffect(() => {

    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      } else {
        console.log("Fetched session:", session);
      }

      if (session?.user) {
        // Set the username from user metadata if available
        const user = session.user;
        console.log("Logging as the session user:", session.user);
        setUserName(user.user_metadata?.username);  
        setIsAuthenticated(true);
      } else {
        console.log("No active session found");
        setUserName(null);
        setIsAuthenticated(false);
      }
    };

    fetchSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        console.log(`Auth state changed:`, session);
        if (session?.user) {
          console.log("Logging as the session user:", session.user);
          setUserName(session.user.user_metadata?.username);  
          setIsAuthenticated(true);
        } else {
          setUserName(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (user: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
  
    if (error) {
      console.error("Error fetching username:", error);
      return;
    }
  
    setUserName(data.username);
    localStorage.setItem("username", data.username); 
    setIsAuthenticated(true);
  };
  
  const logout = async () => {
    await supabase.auth.signOut();  
    setUserName(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Signed out successfully.",
      description: "You have been logged out.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-left",
    });
  };

  return (
    <AuthContext.Provider value={{ userName, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};