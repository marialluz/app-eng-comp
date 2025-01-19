import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useUserStore } from '../stores/user';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6E2BF1',
    },
    background: {
      default: '#FFFFFF',
    },
  },
  typography: {
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

interface MainLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { accessToken, refreshToken } = useUserStore();
  const isAuthenticated = accessToken || refreshToken;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <Box sx={{ display: 'flex', flex: 1 }}>
          {isAuthenticated && !hideSidebar && <Sidebar open={sidebarOpen} onClose={toggleSidebar} />}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;

