import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useUserStore } from "../stores/user";
import { api } from "../config/api";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface UserResponse {
  username: string;
  email: string;
  is_teacher: boolean;
  is_student: boolean;
  entry_period: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getUserInfo = async () => {
    try {
      const response = await api.get<UserResponse>("/user/me/");
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar informações do usuário:", err);
      throw err;
    }
  };

  const { setAccessToken, setRefreshToken, setUserInfo } = useUserStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      // 1. Fazer login e obter tokens
      const loginResponse = await api.post<LoginResponse>(
        "/auth/token/",
        formData
      );

      const accessToken = loginResponse.data.access;
      const refreshToken = loginResponse.data.refresh;

      // 2. Salvar tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // 3. Buscar informações do usuário
      const userInfo = await getUserInfo();

      setUserInfo(userInfo);

      // 4. Redirecionar com base no tipo de usuário
      if (userInfo.is_teacher) {
        navigate("/dashboard/teacher");
      } else if (userInfo.is_student) {
        navigate("/dashboard/student");
      } else {
        setError("Tipo de usuário não identificado");
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Erro ao fazer login. Por favor, tente novamente mais tarde.";
      setError(errorMessage);
    }
  };

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
          width: "100%",
          maxWidth: "1763px",
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
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
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
