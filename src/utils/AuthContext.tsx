import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../utils/SupabaseClient";
import { useToast } from "@chakra-ui/react";
import { Session } from '@supabase/supabase-js'
import { getCookies } from 'typescript-cookie'

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const toast = useToast();

  const fetchSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error);
    } else {
      setSession(session)
    }

    if (session?.user) {
      // Set the username from user metadata if available
      const user = session.user;
      setUserName(user.user_metadata?.username);
      setIsAuthenticated(true);
    } else {
      
      setUserName(null);
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  // Monitor the user's session
  useEffect(() => {
    fetchSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        
        if (session?.user) {
          setUserName(session.user.user_metadata?.username);
          setIsAuthenticated(true);
        } else {
          setUserName(null);
          setSession(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user?.id) {
      console.error("Error fetching authenticated user:", userError);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userData.user.id)
      .single();

    if (error) {
      console.error("Error fetching username:", error);
      return;
    }

    setUserName(data.username);
    localStorage.setItem("username", data.username);
    setIsAuthenticated(true);
    fetchSession();
  };


  const logout = async () => {
    await supabase.auth.signOut();
    setUserName(null);
    setIsAuthenticated(false);
    localStorage.clear();

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
    <AuthContext.Provider value={{ session, userName, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};