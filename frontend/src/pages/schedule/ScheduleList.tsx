import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  period: string;
  subjects: string[];
}

const ScheduleList: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SchedulePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SchedulePlan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [planDetails, setPlanDetails] = useState<any>(null);

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

  const fetchPlanDetails = async (planId: number) => {
    setDialogLoading(true);
    setDialogError(null);
    try {
      const { data } = await api.get(`/schedule/${planId}/`);
      setPlanDetails(data);
    } catch (err) {
      setDialogError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar detalhes do plano"
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDeletePlan = async (event: React.MouseEvent, planId: number) => {
    event.stopPropagation();
    try {
      await api.delete(`/schedule/${planId}/`);
      setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
      if (selectedPlan?.id === planId) {
        setDialogOpen(false);
      }
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao excluir o plano"
      );
    }
  };

  const handlePlanClick = (plan: SchedulePlan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
    fetchPlanDetails(plan.id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPlan(null);
    setPlanDetails(null);
    setDialogError(null);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box mb={2}>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/student")}
          >
            Voltar para o Dashboard
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Seus Planos de Grade Curricular
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <List>
              {plans.map((plan) => (
                <ListItem
                  key={plan.period}
                  onClick={() => handlePlanClick(plan)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={`Período: ${plan.period}`}
                    secondary={plan.subjects?.join(", ")}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDeletePlan(e, plan.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/schedule/planner")}
            >
              Criar Novo Plano
            </Button>
          </Box>
        </Paper>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedPlan?.period}</DialogTitle>
          <DialogContent>
            {dialogLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : dialogError ? (
              <Typography color="error">{dialogError}</Typography>
            ) : planDetails ? (
              <Box>
                {/* Aqui você pode adicionar mais detalhes do plano conforme necessário */}
                <Typography variant="body1">
                  {/* Renderize os detalhes do plano aqui baseado na estrutura do seu planDetails */}
                  {JSON.stringify(planDetails, null, 2)}
                </Typography>
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default ScheduleList;
