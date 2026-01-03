import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CustomSuspense from "./components/CustomSuspense";
import { NotFoundPage } from "./components/page-not-found/PageNotFoundRoute";
import AuthenticatedRoutes from "./route-guards/authenticated";
import RedirectIfAuthenticatedRoutes from "./route-guards/redirect-if-authenticated";
import { theme } from "./theme";
import { useAppDispatch } from "./store/hooks";
import { loginSuccess } from "./store/slices/authSlice";
import { ThemeProvider } from "./contexts/ThemeContext";

const AuthModule = lazy(() => import("@/modules/auth/AuthModule"));
const Layout = lazy(() => import("@/layout/Layout"));

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check for existing session in localStorage
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          const user = JSON.parse(userStr);
          const expiresAt = localStorage.getItem('expires_at');
          const loginTime = localStorage.getItem('login_time');

          // Restore session if not expired
          if (expiresAt && new Date(expiresAt) > new Date()) {
            dispatch(loginSuccess({
              user,
              token,
              loginTime: loginTime || new Date().toISOString(),
              expiresAt,
            }));
          }
        }
      } catch (error) {
        console.error('Session restore failed');
      }
      setLoading(false);
    };

    initApp();
  }, [dispatch]);

  if (loading) {
    return (
      <MantineProvider theme={theme}>
        <LoadingOverlay visible loaderProps={{ color: "blue" }} />
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <ThemeProvider>
        <ModalsProvider>
          <Notifications position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="app" replace />} />

              <Route element={<RedirectIfAuthenticatedRoutes />}>
                <Route
                  path="auth/*"
                  element={
                    <CustomSuspense>
                      <AuthModule />
                    </CustomSuspense>
                  }
                />
              </Route>

              <Route element={<AuthenticatedRoutes />}>
                <Route
                  path="app/*"
                  element={
                    <CustomSuspense>
                      <Layout />
                    </CustomSuspense>
                  }
                />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}

export default App;
