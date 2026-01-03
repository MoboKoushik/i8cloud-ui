/**
 * RaaS Module
 *
 * Reporting as a Service - Publicly Exposed Reports management
 */

import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const RaasReportsPage = lazy(() => import('./pages/RaasReportsPage'));

const RaasModule = () => {
  return (
    <Routes>
      <Route index element={<RaasReportsPage />} />
      <Route path="reports" element={<RaasReportsPage />} />
      <Route path="*" element={<Navigate to="reports" replace />} />
    </Routes>
  );
};

export default RaasModule;
