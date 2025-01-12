import React from 'react';
import { Typography, Grid, Paper, Button } from '@mui/material';
import MainLayout from '../layouts/MainLayout';

const TeacherDashboard: React.FC = () => {
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
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Adicionar Disciplina
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
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Materiais</Typography>
            {/* Adicionar visualização de materiais */}
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default TeacherDashboard;

