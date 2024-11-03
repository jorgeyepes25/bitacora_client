// App.jsx
import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components";
import Spinner from "./components/Spinner";
import { useCheckBackend } from "./hooks/useCheckBackend";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage } from "./pages";

const LoginPage = lazy(() => import("./pages/LoginPage"));

const App = () => {
  const { backendReady, loading } = useCheckBackend();

  if (loading) {
    return <Spinner />;
  }

  if (!backendReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">El backend no está disponible, por favor intenta más tarde.</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <RootLayout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          </Routes>
        </RootLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
