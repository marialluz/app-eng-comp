import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import { api } from "../config/api";
import { RegisterData, registerSchema } from "../schemas/register";

const Register: React.FC = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const isStudent = watch("is_student");

  const navigate = useNavigate();

  const registerTextField = (name: keyof RegisterData) => ({
    ...register(name),
    error: !!errors[name]?.message,
    helperText: errors[name]?.message,
  });

  const navigateToLogin = () => {
    navigate("/login");
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      // Remove o campo entry_period se is_teacher for true
      const payload = { ...values };
      if (payload.is_teacher) {
        delete payload.entry_period;
      }
  
      const { data } = await api.post("http://localhost:8000/user/", payload);
      console.log({ data });
      navigateToLogin();
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.non_field_errors?.[0];
      setServerErrorMessage(
        errorMessage ||
          "Erro ao registrar o usuário. Tente novamente mais tarde."
      );
    }
  });

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Registro
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            width: 400,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Usuário"
            autoComplete="username"
            autoFocus
            {...registerTextField("username")}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            autoComplete="email"
            {...registerTextField("email")}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            {...registerTextField("password")}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmar senha"
            type="password"
            {...registerTextField("confirm_password")}
          />
          <TextField
            margin="normal"
            fullWidth
            required={isStudent}
            label="Período de ingresso"
            {...registerTextField("entry_period")}
          />

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("is_student")}
                  color={errors.is_student?.message ? "error" : "primary"}
                />
              }
              label="Aluno?"
            />
            <FormControlLabel
              control={
                <Checkbox
                  {...register("is_teacher")}
                  color={errors.is_teacher?.message ? "error" : "primary"}
                />
              }
              label="Professor?"
            />

            {errors.is_student?.message && (
              <Typography variant="body2" color="error">
                {errors.is_student?.message}
              </Typography>
            )}
          </Box>

          {serverErrorMessage && (
            <Alert sx={{ mt: 2 }} severity="error">
              {serverErrorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrar
          </Button>
          <Button
            onClick={navigateToLogin}
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
