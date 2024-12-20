import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components";
import Spinner from "./components/Spinner";
import { useCheckBackend } from "./hooks/useCheckBackend";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage, BitacoraDetailPage, UserPage, RolesPage } from "./pages";
import SettingsLayout from "./layouts/SettingsLayout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

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
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/bitacora/:id" element={<BitacoraDetailPage />} />
              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<UserPage />} />
                <Route path="users" element={<UserPage />} />
                <Route path="roles" element={<RolesPage />} />
              </Route>
            </Routes>
          </Suspense>
        </RootLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
