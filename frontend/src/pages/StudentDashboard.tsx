import { Button, CircularProgress, Divider, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

interface Directory {
  id: number;
  subject: string;
}

interface File {
  id: number;
  name: string;
  directory_id: number;
}

interface Planning {
  id: number;
  period: string;
  subjects: string[];
}

const StudentDashboard: React.FC = () => {
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recentPlannings, setRecentPlannings] = useState<Planning[]>([]);
  const [loadingPlannings, setLoadingPlannings] = useState(true);
  const [errorPlannings, setErrorPlannings] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const handleNavigateToMaterials = () => navigate('/materials');
  const handleNavigateToPosts = () => navigate('/posts');
  const handleNavigateToCurriculum = () => navigate('/curriculum');
  const handleNavigateToSchedulePlanner = () => navigate('/schedule/planner');
  const handleNavigateToScheduleList = () => navigate('/schedule/list');
  
  const fetchPlannings = async () => {
    try {
      setLoadingPlannings(true);
      const response = await fetch('/schedule/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os planejamentos');
      }

      const plannings: Planning[] = await response.json();

      // Ordenar por período (assumindo formato "ano.semestre") e pegar os 2 mais recentes
      const sortedPlannings = plannings
        .sort((a, b) => b.period.localeCompare(a.period))
        .slice(0, 2);

      setRecentPlannings(sortedPlannings);
    } catch (err) {
      setErrorPlannings(err instanceof Error ? err.message : 'Erro ao carregar planejamentos');
      console.error('Erro ao buscar planejamentos:', err);
    } finally {
      setLoadingPlannings(false);
    }
  };

  useEffect(() => {
    fetchPlannings();
  }, []);

  const renderPlanningsList = () => {
    if (loadingPlannings) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (errorPlannings) {
      return (
        <Typography color="error" align="center">
          {errorPlannings}
        </Typography>
      );
    }

    if (!Array.isArray(recentPlannings) || recentPlannings.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="Nenhum planejamento disponível" />
        </ListItem>
      );
    }

    return recentPlannings.map((planning, index) => (
      <React.Fragment key={planning.id}>
        <ListItem>
          <ListItemText
            primary={`Planejamento de ${planning.period}`}
            secondary={`Disciplinas: ${planning.subjects.join(', ')}`}
          />
        </ListItem>
        {index < recentPlannings.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };

  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      
      // Primeiro, buscar todos os diretórios
      const dirResponse = await fetch('/directory/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!dirResponse.ok) {
        throw new Error('Falha ao carregar diretórios');
      }

      const directories: Directory[] = await dirResponse.json();
      
      // Buscar arquivos de cada diretório
      const allFilesPromises = directories.map(dir =>
        fetch(`/directory/${dir.id}/file/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json())
      );

      const allFilesResponses = await Promise.all(allFilesPromises);
      
      // Combinar todos os arquivos em uma única lista
      const allFiles = allFilesResponses.flat();
      
      // Ordenar por data (assumindo que há um campo de data) e pegar os 2 mais recentes
      const recentFiles = allFiles
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);

      setRecentFiles(recentFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar materiais');
      console.error('Erro ao buscar arquivos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  const renderMaterialsList = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center">
          {error}
        </Typography>
      );
    }

    if (!Array.isArray(recentFiles) || recentFiles.length === 0) {
      return (
        <ListItem>
          <ListItemText primary="Nenhum material disponível" />
        </ListItem>
      );
    }

    return recentFiles.map((file, index) => (
      <React.Fragment key={file.id || index}>
        <ListItem>
          <ListItemText 
            primary={file.name}
            secondary={file.directory_id ? `Diretório: ${file.directory_id}` : undefined}
          />
        </ListItem>
        {index < recentFiles.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };
  
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard do Aluno
      </Typography>
      <Grid container spacing={2}>
        {/* Bloco de Materiais, Planejamentos Salvos e Grade Curricular */}
        <Grid item xs={12} md={8} lg={9}>
          <Grid container spacing={2}>
            {/* Materiais */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Materiais
                </Typography>
                <List>
                  {renderMaterialsList()}
                </List>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNavigateToMaterials} 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Adicionar Novo Material
                </Button>
              </Paper>
            </Grid>
  
            {/* Planejamentos Salvos */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Planejamentos Salvos
                </Typography>
                <List>
                  {renderPlanningsList()}
                </List>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleNavigateToScheduleList}>
                  Ver Planejamentos Salvos
                </Button>
                <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleNavigateToSchedulePlanner}>
                  Criar Novo Planejamento
                </Button>
              </Paper>
            </Grid>
  
            {/* Grade Curricular */}
            <Grid item xs={12} md={12} lg={12}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Grade Curricular
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleNavigateToCurriculum}>
                  Ver Estrutura Curricular 
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Últimas Notícias */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Últimas Notícias
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Prazo de entrega para TCC prorrogado" secondary="Data: 12/01/2025" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Novo calendário de provas divulgado" secondary="Data: 11/01/2025" />
              </ListItem>
            </List>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleNavigateToPosts}>
              Ver Mais Notícias
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}

export default StudentDashboard;

