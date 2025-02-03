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
import OHScramble from "./pages/OHScramble";
import { ReactNode } from "react";
import AboutPage from "./pages/About";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./utils/AuthContext";
import Plausible from "plausible-tracker";

export const plausible = Plausible({
  domain: "crystalcuber.com",
  apiHost: "/external",
});

plausible.enableAutoPageviews();

function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return (
    <Flex direction="column" h="100vh">
      {isAuthenticated && <NavBar />}
      <Container className="content" px={0} pt={14} maxW="100vw">
        {children}
      </Container>
    </Flex>
  );
}

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
}

const router = createBrowserRouter(

  createRoutesFromElements(
    <Route path="/" element={ <Layout> <Outlet /> </Layout>} errorElement={<Layout><ErrorPage /></Layout>}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
      <Route index element={<Home />} />
      <Route path="train">
        <Route index element={<TrainerPage />} />
        <Route path="cross">
          <Route index element={<CrossTrainerPage />} />
        </Route>
        <Route path="eo" element={<EOStepTrainerPage />} />
      </Route>
      {/* redirect for old /trainer path */}
      <Route path="trainer" element={<Navigate to="/train" />} />
      <Route path="tools">
        <Route path="ohscramble" element={<OHScramble />} />
      </Route>
      <Route path="about" element={<AboutPage />} />

      </Route>
    </Route>

  )
);

export default function App() {
  return(
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  )
}


