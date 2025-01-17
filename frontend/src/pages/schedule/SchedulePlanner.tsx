import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface Subject {
  code: string;
  name: string;
  period: string;
  prerequisites: string[];
}

interface Semester {
  period: string;
  subjects: Subject[];
}

const SchedulePlanner: React.FC = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('');
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Subject[]>('/api/subjects');
        if (Array.isArray(response.data)) {
          setSubjects(response.data);
        } else {
          throw new Error('Received invalid data format for subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Failed to load subjects. Please try again later.');
        setSnackbar({ open: true, message: 'Error fetching subjects', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = () => {
    if (selectedSubjectCode && currentPeriod) {
      const subject = subjects.find(s => s.code === selectedSubjectCode);
      if (!subject) {
        setSnackbar({ open: true, message: 'Subject not found', severity: 'error' });
        return;
      }

      if (checkPrerequisites(subject)) {
        setSemesters(prevSemesters => {
          const existingSemester = prevSemesters.find(s => s.period === currentPeriod);
          if (existingSemester) {
            return prevSemesters.map(s => 
              s.period === currentPeriod 
                ? { ...s, subjects: [...s.subjects, subject] }
                : s
            );
          } else {
            return [...prevSemesters, { period: currentPeriod, subjects: [subject] }];
          }
        });
        setSnackbar({ open: true, message: 'Disciplina adicionada com sucesso!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Pré-requisitos não atendidos!', severity: 'error' });
      }
    }
  };

  const handleRemoveSubject = (period: string, subjectCode: string) => {
    setSemesters(prevSemesters => {
      return prevSemesters.map(semester => {
        if (semester.period === period) {
          return {
            ...semester,
            subjects: semester.subjects.filter(subject => subject.code !== subjectCode)
          };
        }
        return semester;
      });
    });
  };

  const checkPrerequisites = (subject: Subject): boolean => {
    const allPlannedSubjects = semesters.flatMap(s => s.subjects.map(sub => sub.code));
    return subject.prerequisites.every(prereq => allPlannedSubjects.includes(prereq));
  };

  const handleSavePlan = async () => {
    try {
      const planData = {
        subjects: semesters.flatMap(semester => semester.subjects.map(subject => subject.code)),
        period: currentPeriod
      };
      await axios.post('/api/schedule/', planData);
      setSnackbar({ open: true, message: 'Plano salvo com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Error saving plan:', error);
      setSnackbar({ open: true, message: 'Error saving plan', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
        <Button variant="outlined" onClick={() => navigate('/dashboard/student')}>
                  Voltar para o Dashboard
        </Button>
          <Typography variant="h6" color="error" align="center">
            {error}
          </Typography>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg">
      <Button variant="outlined" onClick={() => navigate('/dashboard/student')}>
                  Voltar para o Dashboard
      </Button>
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Planejador de Grade Curricular
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar Disciplina
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="subject-select-label">Disciplina</InputLabel>
                <Select
                  labelId="subject-select-label"
                  id="subject-select"
                  value={selectedSubjectCode}
                  label="Disciplina"
                  onChange={(e) => setSelectedSubjectCode(e.target.value as string)}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.code} value={subject.code}>
                      {subject.name} ({subject.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Período (ex: 2025.1)"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddSubject}
                fullWidth
              >
                Adicionar Disciplina
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sua Grade Curricular
              </Typography>
              {semesters.map((semester) => (
                <Box key={semester.period} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {`Período: ${semester.period}`}
                  </Typography>
                  <List>
                    {semester.subjects.map((subject) => (
                      <ListItem key={subject.code}>
                        <ListItemText
                          primary={subject.name}
                          secondary={`Código: ${subject.code}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveSubject(semester.period, subject.code)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard/student')}>
            Voltar para o Dashboard
          </Button>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSavePlan}>
            Salvar Plano
          </Button>
        </Box>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default SchedulePlanner;

