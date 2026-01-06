import { useAppSelector } from "@/store/hooks";
import { AbilityContext } from "@/utils/Can";
import {
  defineAbility,
  type MongoAbility,
} from "@casl/ability";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import type { Actions } from "@/config/ability"; // Adjust path if needed

const AuthenticatedRoutes = () => {
  const authState = useAppSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.user) {
      navigate("/auth/login");
    }
  }, [authState.user, navigate]);

  if (!authState.user) {
    return <Navigate to="/auth/login" />;
  }


  const ability = defineAbility<MongoAbility<[Actions, string]>>((can) => {
    authState?.user?.role?.permissions.forEach((permission) => {
      can(permission.action as Actions, permission.subject);
    });
  });

  return (
    <AbilityContext.Provider value={ability || null}>
      <Outlet />
    </AbilityContext.Provider>
  );
};

export default AuthenticatedRoutes;
