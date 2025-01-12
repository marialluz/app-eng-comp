import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar toggleSidebar={toggleSidebar} />
        <Box sx={{ display: 'flex', flex: 1 }}>
          {!hideSidebar && <Sidebar open={sidebarOpen} onClose={toggleSidebar} />}
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

