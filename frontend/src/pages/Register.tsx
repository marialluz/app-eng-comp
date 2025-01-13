import React, { useState } from "react";
import { Box, Button, TextField, Typography, FormControlLabel, Checkbox } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setFullName(name);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userData = {
      username: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirmPassword"),
      is_student: isStudent,
      is_teacher: isTeacher,
      entry_period: formData.get("entry_period"),
    };

    console.log(userData)

    try {
      const response = await fetch("http://localhost:8000/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const data = await response.json();
        console.log(data);
        setErrorMessage(data?.non_field_errors || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro ao registrar o usuário", error);
      
      setErrorMessage("Erro ao registrar o usuário. Tente novamente mais tarde.");
    }
  };

  const handleClickLogin = () => {
    navigate("/login");
  };

  const handleStudentChange = () => {
    setIsStudent(true);
    setIsTeacher(false);
  };

  const handleTeacherChange = () => {
    setIsTeacher(true);
    setIsStudent(false);
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
            value={fullName}
            onChange={handleNameChange}
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
          <TextField
            margin="normal"
            fullWidth
            required
            name="entry_period"
            label="Período de ingresso"
            id="entry_period"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isStudent}
                onChange={handleStudentChange}
                color="primary"
              />
            }
            label="Aluno?"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isTeacher}
                onChange={handleTeacherChange}
                color="primary"
              />
            }
            label="Professor?"
          />

          {errorMessage && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Registrar
          </Button>
          <Button onClick={handleClickLogin} sx={{ all: "unset", cursor: "pointer" }}>
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
