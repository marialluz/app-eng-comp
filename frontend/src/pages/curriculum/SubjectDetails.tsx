import {
    Box,
    Button,
    Chip,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

// This would typically come from an API or a larger data store
const mockSubjects = {
  'COMP101': { 
    id: 'COMP101', 
    name: 'Introdução à Computação', 
    type: 'mandatory', 
    credits: 4, 
    prerequisites: [],
    description: 'Esta disciplina fornece uma introdução aos conceitos fundamentais da ciência da computação e programação.',
    objectives: [
      'Compreender os conceitos básicos de algoritmos',
      'Aprender a lógica de programação',
      'Familiarizar-se com uma linguagem de programação de alto nível'
    ]
  },
  'COMP201': { 
    id: 'COMP201', 
    name: 'Estruturas de Dados', 
    type: 'mandatory', 
    credits: 4, 
    prerequisites: ['COMP101'],
    description: 'Esta disciplina aborda as principais estruturas de dados utilizadas em programação e sua aplicação.',
    objectives: [
      'Compreender e implementar estruturas de dados básicas e avançadas',
      'Analisar a complexidade de algoritmos',
      'Aplicar estruturas de dados na resolução de problemas computacionais'
    ]
  },
  // Add more subjects as needed
};

const SubjectDetails: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = mockSubjects[subjectId as keyof typeof mockSubjects];

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
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={subject.type === 'mandatory' ? 'Obrigatória' : subject.type === 'elective' ? 'Eletiva' : 'Optativa'} 
              color={subject.type === 'mandatory' ? 'primary' : subject.type === 'elective' ? 'secondary' : 'default'}
            />
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Créditos: {subject.credits}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>Descrição</Typography>
          <Typography paragraph>{subject.description}</Typography>
          
          <Typography variant="h6" gutterBottom>Objetivos</Typography>
          <List>
            {subject.objectives.map((objective, index) => (
              <ListItem key={index}>
                <ListItemText primary={objective} />
              </ListItem>
            ))}
          </List>
          
          <Typography variant="h6" gutterBottom>Pré-requisitos</Typography>
          {subject.prerequisites.length > 0 ? (
            <List>
              {subject.prerequisites.map((prereq) => (
                <ListItemButton
                  key={prereq}
                  onClick={() => navigate(`/curriculum/${prereq}`)}
                >
                  <ListItemText
                    primary={mockSubjects[prereq as keyof typeof mockSubjects]?.name || prereq}
                  />
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
              <Button variant="contained" color="primary" onClick={() => navigate(`/curriculum/prerequisites/${subject.id}`)}>
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

