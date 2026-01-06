import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "@/store/store";

const RedirectIfAuthenticatedRoutes = () => {
  const authState = useAppSelector((state: RootState) => state.auth);

  return authState.user ? <Navigate to="/app" /> : <Outlet />;
};

export default RedirectIfAuthenticatedRoutes;
