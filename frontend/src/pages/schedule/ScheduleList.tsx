import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface SchedulePlan {
  id: number;
  name: string;
  createdAt: string;
}

const mockPlans: SchedulePlan[] = [
  { id: 1, name: 'Plano 2025 - 1º semestre', createdAt: '2025-01-15' },
  { id: 2, name: 'Plano 2025 - 2º semestre', createdAt: '2025-06-20' },
  { id: 3, name: 'Plano 2026 - Completo', createdAt: '2025-12-01' },
];

const ScheduleList: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SchedulePlan[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the plans from an API
    setPlans(mockPlans);
  }, []);

  const handleEditPlan = (planId: number) => {
    // Navigate to the SchedulePlanner with the selected plan
    navigate(`/schedule/planner/${planId}`);
  };

  const handleDeletePlan = (planId: number) => {
    // In a real application, you would send a delete request to an API
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Seus Planos de Grade Curricular
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {plans.map((plan) => (
              <ListItem key={plan.id}>
                <ListItemText
                  primary={plan.name}
                  secondary={`Criado em: ${new Date(plan.createdAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditPlan(plan.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePlan(plan.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard/student')}>
            Voltar para o Dashboard
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/schedule/planner')}>
            Criar Novo Plano
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ScheduleList;

