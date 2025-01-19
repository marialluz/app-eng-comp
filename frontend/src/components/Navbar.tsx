import { LogoutOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { username, accessToken, refreshToken, clearTokens } = useUserStore();
  const isAuthenticated = accessToken || refreshToken;
  const navigate = useNavigate();
  const navigateToLandingPage = () => {
    navigate("/");
  }
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={navigateToLandingPage}>
          CompFlow
        </Typography>
        {isAuthenticated ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography>{username}</Typography>
            <Button
              sx={{
                all: "unset",
                display: "flex",
                alignItems: "center",
                transition: "all .2s linear",
                ":hover": { color: "red" },
                cursor: "pointer",
              }}
              onClick={() => {
                clearTokens();
                navigateToLogin();
              }}
              color="inherit"
              size="small"
            >
              <LogoutOutlined />
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={navigateToLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
