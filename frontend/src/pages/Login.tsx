import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implementar lógica de login aqui
  };

  const navigate = useNavigate();

  const handleClickRegister = () => {
    navigate("/register");
  };

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          width: 1763,
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, display: "flex", flexDirection: "column", width: 400 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Button
              onClick={handleClickRegister}
              sx={{ all: "unset", cursor: "pointer" }}
            >
              <Typography variant="body2" align="center">
                Não tem uma conta? Registre-se
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Login;
