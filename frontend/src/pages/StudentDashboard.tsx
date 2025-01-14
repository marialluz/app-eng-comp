import { Button, Divider, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate(); 

  const handleNavigateToMaterials = () => navigate('/materials');  

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard do Aluno
      </Typography>
      <Grid container spacing={3} justifyContent="center">

        {/* Materiais */}
        <Grid item xs={12} md={6} lg={4} >
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Materiais
            </Typography>
            <List>
              {/* Exemplo de materiais organizados */}
              <ListItem>
                <ListItemText primary="Cálculo 1 - Apostila.pdf" secondary="Disciplina: Matemática" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Algoritmos - Exercícios.zip" secondary="Disciplina: Algoritmos" />
              </ListItem>
              {/* Adicione mais materiais conforme necessário */}
            </List>
            <Button variant="contained" color="primary" onClick={handleNavigateToMaterials} fullWidth sx={{ mt: 2 }}>
              Adicionar Novo Material
            </Button>
          </Paper>
        </Grid>

        {/* Últimas Notícias */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Últimas Notícias
            </Typography>
            <List>
              {/* Exemplo de notícias recentes */}
              <ListItem>
                <ListItemText primary="Prazo de entrega para TCC prorrogado" secondary="Data: 12/01/2025" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Novo calendário de provas divulgado" secondary="Data: 11/01/2025" />
              </ListItem>
              {/* Adicione mais notícias conforme necessário */}
            </List>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Ver Mais Notícias
            </Button>
          </Paper>
        </Grid>

        {/* Planejamentos Salvos */}
        <Grid item xs={12} md={6} lg={4} alignItems="center">
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Planejamentos Salvos
            </Typography>
            <List>
              {/* Exemplo de planejamentos salvos */}
              <ListItem>
                <ListItemText primary="Planejamento de 2025 - 1º semestre" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Planejamento de 2024 - 2º semestre" />
              </ListItem>
              {/* Adicione mais planejamentos conforme necessário */}
            </List>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Criar Novo Planejamento
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Grade Curricular
            </Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Ver Estrutura Curricular 
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default StudentDashboard;
