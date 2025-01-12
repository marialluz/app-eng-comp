import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implementar lógica de registro aqui
  };

  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/login");
  };

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          width: 1863,
        }}
      >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Registro
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
              id="name"
              label="Nome completo"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar senha"
              type="password"
              id="confirmPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>
            <Button
              onClick={handleClickLogin}
              sx={{ all: "unset", cursor: "pointer" }}
            >
              <Typography variant="body2" align="center">
                Já tem uma conta? Faça login
              </Typography>
            </Button>
          </Box>
        
      </Box>
    </MainLayout>
  );
};

export default Register;
