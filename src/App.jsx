import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components";
import { ProgressSpinner } from "primereact/progressspinner";
import { serverRun } from "./services/RunService";
import { HomePage } from "./pages";

const LoginPage = lazy(() => import("./pages/LoginPage"));

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para hacer la consulta al servidor cuando la aplicación cargue
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await serverRun();
        if (response === "pong") {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al verificar el servidor:", err);
        setError("El servidor no responde");
        setLoading(false);
      }
    };
    checkServerStatus();
  }, []);

  // Mientras cargamos, mostramos el spinner o el mensaje de error si falla
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="10" fill="var(--surface-ground)" animationDuration=".5s" />
      </div>
    );
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <Suspense fallback={<ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
  }>
      <BrowserRouter>
        <RootLayout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
