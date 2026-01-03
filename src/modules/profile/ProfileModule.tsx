/**
 * Profile Module
 *
 * User profile and account settings
 */

import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const ProfileModule = () => {
  return (
    <Routes>
      <Route index element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default ProfileModule;
