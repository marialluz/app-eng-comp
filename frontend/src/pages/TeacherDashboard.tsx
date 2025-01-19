import { Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigateToCurriculum = () => navigate("/curriculum");

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard do Professor
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Gerenciamento de Disciplinas</Typography>
            {/* Adicionar lista de disciplinas */}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleNavigateToCurriculum}>
              Ver Estrutura Curricular
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Postagens</Typography>
            {/* Adicionar lista de postagens recentes */}
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Criar Nova Postagem
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default TeacherDashboard;

