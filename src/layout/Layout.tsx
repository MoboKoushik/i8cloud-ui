/**
 * Layout Component - Main Application Layout
 *
 * Responsive AppShell-based layout with collapsible sidebar and top navbar
 */

import { useEffect } from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Navbar } from './navbar/Navbar';
import { Sidebar } from './sidebar/Sidebar';
import AppRoutes from '../AppRoutes';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile) {
      closeMobile();
    }
  }, [isMobile, closeMobile]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: desktopOpened ? 240 : 70,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
      padding={0}
      styles={{
        main: {
          backgroundColor: '#f8f9fa',
          minHeight: 'calc(100vh - 60px)',
        },
      }}
    >
      <AppShell.Header
        style={{
          borderBottom: '1px solid #dee2e6',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Navbar
          mobileOpened={mobileOpened}
          desktopOpened={desktopOpened}
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
        />
      </AppShell.Header>

      <AppShell.Navbar
        style={{
          borderRight: '1px solid #dee2e6',
          background:
            theme.sidebarStyle === 'gradient'
              ? `linear-gradient(180deg, ${theme.sidebarColor} 0%, ${theme.primaryColor} 100%)`
              : theme.sidebarColor,
          transition: 'width 200ms ease',
          boxShadow: '1px 0 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Sidebar toggleMobile={toggleMobile} collapsed={!desktopOpened} />
      </AppShell.Navbar>

      <AppShell.Main>
        <AppRoutes />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
