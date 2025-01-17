import styled from '@emotion/styled';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography
} from '@mui/material';
import React from 'react';

import { Tree, TreeNode } from 'react-organizational-chart';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

// This would typically come from an API or a larger data store
const mockSubjects = {
  'COMP101': { id: 'COMP101', name: 'Introdução à Computação', prerequisites: [] },
  'COMP201': { id: 'COMP201', name: 'Estruturas de Dados', prerequisites: ['COMP101'] },
  'COMP301': { id: 'COMP301', name: 'Algoritmos Avançados', prerequisites: ['COMP201'] },
  'COMP401': { id: 'COMP401', name: 'Inteligência Artificial', prerequisites: ['COMP301', 'MATH201'] },
  'MATH101': { id: 'MATH101', name: 'Cálculo I', prerequisites: [] },
  'MATH201': { id: 'MATH201', name: 'Cálculo II', prerequisites: ['MATH101'] },
  // Add more subjects as needed
};

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid #1976d2;
`;

const PreRequisites: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = mockSubjects[subjectId as keyof typeof mockSubjects];

  if (!subject) {
    return <Typography>Disciplina não encontrada</Typography>;
  }

  const renderTree = (subjectId: string): React.ReactNode => {
    const subject = mockSubjects[subjectId as keyof typeof mockSubjects];
    return (
      <TreeNode 
        label={
          <StyledNode onClick={() => navigate(`/curriculum/${subject.id}`)}>
            {subject.name}
          </StyledNode>
        }
      >
        {subject.prerequisites.map((prereqId) => renderTree(prereqId))}
      </TreeNode>
    );
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Árvore de Pré-requisitos: {subject.name}
        </Typography>
        <Paper elevation={3} sx={{ p: 3, overflowX: 'auto' }}>
          <Box sx={{ minWidth: 600, pb: 3 }}>
            <Tree
              lineWidth={'2px'}
              lineColor={'#bbb'}
              lineBorderRadius={'10px'}
              label={<div>Árvore de Pré-requisitos</div>}
            >
              {renderTree(subject.id)}
            </Tree>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={() => navigate(`/curriculum/${subject.id}`)}>
              Voltar para Detalhes da Disciplina
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/curriculum')}>
              Ver Estrutura Curricular Completa
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PreRequisites;

