/**
 * Auth Module
 *
 * Handles authentication routes
 */

import CustomSuspense from "@/components/CustomSuspense";
import { NotFoundPage } from "@/components/page-not-found/PageNotFoundRoute";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));

const AuthModule = () => {
  return (
    <Routes>
      <Route path="login" element={
        <CustomSuspense>
          <LoginPage />
        </CustomSuspense>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AuthModule;
