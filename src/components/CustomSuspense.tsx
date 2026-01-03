/**
 * CustomSuspense Component
 *
 * Provides a loading fallback for lazy-loaded components
 */

import { LoadingOverlay } from '@mantine/core';
import { Suspense, type ReactNode } from 'react';

interface CustomSuspenseProps {
  children: ReactNode;
}

const CustomSuspense = ({ children }: CustomSuspenseProps) => {
  return (
    <Suspense
      fallback={
        <LoadingOverlay
          visible={true}
          overlayProps={{ blur: 2 }}
          loaderProps={{ color: 'blue', type: 'dots' }}
        />
      }
    >
      {children}
    </Suspense>
  );
};

export default CustomSuspense;
