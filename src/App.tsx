import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Container, Flex } from "@chakra-ui/react";
import { useAuth } from "./utils/AuthContext";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import CrossTrainerPage from "./pages/train/CrossTrainerPage";
import EOStepTrainerPage from "./pages/train/EOStepTrainerPage";
import TrainerPage from "./pages/train";
import TestPage from "./pages/TestPage";
import OHScramble from "./pages/OHScramble";
import { ReactNode, useEffect, useState } from "react";
import AboutPage from "./pages/About";
import LoginPage from "./pages/user/LoginPage";
import { AuthProvider } from "./utils/AuthContext";
import Timer from "./components/Timer";
import Plausible from "plausible-tracker";
import DefinitionsPage from "./pages/Definitions/definitions";
import Register from "./pages/user/RegisterPage";
import ProfilePage from "./pages/user/ProfilePage";
import RecoverPage from "./pages/user/RecoverPage";
import { Session } from "@supabase/supabase-js";
import { supabase } from './utils/SupabaseClient';
import UserSolveTable from "./components/User/UserSolveTable";

export const plausible = Plausible({
  domain: "crystalcuber.com",
  apiHost: "/external",
});
plausible.enableAutoPageviews();

function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" h="50vh">
      <NavBar />
      <Container className="content" px={0} pt={14} maxW="100vw">
        {children}
      </Container>
    </Flex>
  );
}

function createAppRouter(session: Session | null) {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<Layout><Outlet /></Layout>}
        errorElement={<Layout><ErrorPage /></Layout>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={session ? <ProfilePage session={session} /> : <LoginPage />}/>
        <Route index element={<Home />} />
        <Route path="train">
          <Route index element={<TrainerPage />} />
          <Route path="cross">
            <Route index element={<CrossTrainerPage />} />
          </Route>
          <Route path="eo" element={<EOStepTrainerPage />} />
        </Route>
        {/* Redirect for old /trainer path */}
        <Route path="trainer" element={<Navigate to="/train" />} />
        <Route path="tools">
          <Route path="ohscramble" element={<OHScramble />} />
        </Route>
        <Route path="about" element={<AboutPage />} />
        <Route path="timer" element={session ? <Timer session={session} /> : <Timer session={null} />} />
        <Route path="definitions" element={<DefinitionsPage />} />
        <Route path="recover" element={<RecoverPage />} />
        <Route path="grid" element={<UserSolveTable />} />
      </Route>
    )
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const loadSession = async () => {
      try {
        // First, check if there's a session already in localStorage
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Loaded session from Supabase:', session);
        setSession(session);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change detected:', session);
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  const router = createAppRouter(session); 

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}