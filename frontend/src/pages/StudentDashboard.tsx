import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

const StudentDashboard: React.FC = () => {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard do Aluno
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Grade Curricular</Typography>
            {/* Adicionar conteúdo da grade curricular */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Materiais</Typography>
            {/* Adicionar lista de materiais recentes */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Últimas Notícias</Typography>
            {/* Adicionar lista de notícias recentes */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Planejamentos Salvos</Typography>
            {/* Adicionar lista de planejamentos salvos */}
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default StudentDashboard;

