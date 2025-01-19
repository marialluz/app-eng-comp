import { Box, Button, Container, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../config/api';
import MainLayout from '../../layouts/MainLayout';

interface Subject {
  code: string;
  name: string;
  period: string;
  prerequisites: string[];
}

const SubjectDetails: React.FC = () => {
  const { subjectCode } = useParams<{ subjectCode: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectCode) return;
    const fetchSubject = async () => {
      try {
        const response = await api.get(`/subject/${subjectCode}/`);
        const subjectData = response.data as Subject;
        // Certifique-se de que prerequisites seja sempre um array
        setSubject({
          ...subjectData,
          prerequisites: subjectData.prerequisites || [],
        });
      } catch {
        setSubject(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubject();
  }, [subjectCode]);

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!subject) {
    return <Typography>Disciplina não encontrada</Typography>;
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          {subject.name}
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Pré-requisitos</Typography>
          {subject.prerequisites && subject.prerequisites.length > 0 ? (
            console.log('Pré-requisitos:', subject.prerequisites),
            <List>
              {subject.prerequisites.map((prereqCode) => (
                <ListItemButton
                  key={prereqCode}
                  onClick={() => navigate(`/curriculum/${prereqCode}`)}
                >
                  <ListItemText primary={prereqCode} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography>Não há pré-requisitos para esta disciplina.</Typography>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={() => navigate('/curriculum')}>
              Voltar para a Estrutura Curricular
            </Button>
            {subject.prerequisites.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/curriculum/prerequisites/${subject.code}`)}
              >
                Ver Árvore de Pré-requisitos
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default SubjectDetails;
