import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import MainLayout from "../../layouts/MainLayout";

interface SchedulePlan {
  id: number;
  subjects: string[];
  period: string;
}

const ScheduleList: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SchedulePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<SchedulePlan[]>("/schedule/");

      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      await api.delete(`/schedule/${planId}/`);

      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao excluir o plano"
      );
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <MainLayout>
      <Button variant="outlined" onClick={() => navigate("/dashboard/student")}>
        Voltar para o Dashboard
      </Button>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Seus Planos de Grade Curricular
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <Paper elevation={3} sx={{ p: 2 }}>
            <List>
              {plans.map((plan) => (
                <ListItem key={plan.id}>
                  <ListItemText
                    primary={`Período: ${plan.period}`}
                    secondary={plan.subjects?.join(", ")}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/schedule/planner")}
          >
            Criar Novo Plano
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ScheduleList;
