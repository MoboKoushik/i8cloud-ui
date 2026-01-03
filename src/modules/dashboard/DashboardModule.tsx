/**
 * Dashboard Module
 *
 * Main dashboard view
 */

import CustomSuspense from "@/components/CustomSuspense";
import { NotFoundPage } from "@/components/page-not-found/PageNotFoundRoute";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const DashboardModule = () => {
  return (
    <Routes>
      <Route path="/" element={
        <CustomSuspense>
          <DashboardPage />
        </CustomSuspense>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default DashboardModule;
