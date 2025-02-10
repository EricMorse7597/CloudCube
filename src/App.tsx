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
import Plausible from "plausible-tracker";
import Register from "./pages/user/RegisterPage"
import ProfilePage from "./pages/user/ProfilePage"
import { Session } from '@supabase/supabase-js'
import { supabase } from './utils/SupabaseClient'

export const plausible = Plausible({
  domain: "crystalcuber.com",
  apiHost: "/external",
});

plausible.enableAutoPageviews();

function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
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
        path="/"
        element={<Layout><Outlet /></Layout>}
        errorElement={<Layout><ErrorPage /></Layout>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={session != null ? <ProfilePage session={session} /> : <LoginPage />} />
        <Route index element={<Home />} />
        <Route path="train">
          <Route index element={<TrainerPage />} />
          <Route path="cross" element={<CrossTrainerPage />} />
          <Route path="eo" element={<EOStepTrainerPage />} />
        </Route>
        <Route path="trainer" element={<Navigate to="/train" />} />
        <Route path="tools/ohscramble" element={<OHScramble />} />
      </Route>
    )
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const router = createAppRouter(session)

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
