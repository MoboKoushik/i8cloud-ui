import { useAppSelector } from "@/store/hooks";
import { AbilityContext } from "@/utils/Can";
import { defineAbility } from "@casl/ability";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";

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

  const ability = defineAbility((can) => {
    authState?.user?.role?.permissions.forEach((permission) => {
      can(permission.action, permission.subject);
    });
  });

  return (
    <AbilityContext.Provider value={ability}>
      <Outlet />
    </AbilityContext.Provider>
  );
};

export default AuthenticatedRoutes;
