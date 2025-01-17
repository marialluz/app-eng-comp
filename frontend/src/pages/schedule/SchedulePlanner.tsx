import { Add as AddIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface Subject {
  id: string;
  name: string;
  credits: number;
  prerequisites: string[];
}

interface Semester {
  id: number;
  subjects: Subject[];
}

const mockSubjects: Subject[] = [
  { id: 'COMP101', name: 'Introdução à Computação', credits: 4, prerequisites: [] },
  { id: 'MATH101', name: 'Cálculo I', credits: 4, prerequisites: [] },
  { id: 'PHYS101', name: 'Física I', credits: 4, prerequisites: [] },
  { id: 'COMP201', name: 'Estruturas de Dados', credits: 4, prerequisites: ['COMP101'] },
  { id: 'MATH201', name: 'Cálculo II', credits: 4, prerequisites: ['MATH101'] },
  { id: 'PHYS201', name: 'Física II', credits: 4, prerequisites: ['PHYS101'] },
  // Add more subjects as needed
];

const SchedulePlanner: React.FC = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState<Semester[]>([{ id: 1, subjects: [] }]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleAddSubject = () => {
    if (selectedSubject && selectedSemester) {
      const subject = mockSubjects.find(s => s.id === selectedSubject);
      if (subject) {
        if (checkPrerequisites(subject, selectedSemester)) {
          setSemesters(prevSemesters => {
            const newSemesters = [...prevSemesters];
            const semesterIndex = newSemesters.findIndex(s => s.id === selectedSemester);
            if (semesterIndex !== -1) {
              newSemesters[semesterIndex].subjects.push(subject);
            } else {
              newSemesters.push({ id: selectedSemester, subjects: [subject] });
            }
            return newSemesters.sort((a, b) => a.id - b.id);
          });
          setSnackbar({ open: true, message: 'Disciplina adicionada com sucesso!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Pré-requisitos não atendidos!', severity: 'error' });
        }
      }
    }
  };

  const handleRemoveSubject = (semesterId: number, subjectId: string) => {
    setSemesters(prevSemesters => {
      return prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            subjects: semester.subjects.filter(subject => subject.id !== subjectId)
          };
        }
        return semester;
      });
    });
  };

  const checkPrerequisites = (subject: Subject, semesterId: number): boolean => {
    const previousSemesters = semesters.filter(s => s.id < semesterId);
    const completedSubjects = previousSemesters.flatMap(s => s.subjects.map(sub => sub.id));
    return subject.prerequisites.every(prereq => completedSubjects.includes(prereq));
  };

  const handleSavePlan = () => {
    // Here you would typically save the plan to a backend or local storage
    console.log('Saving plan:', semesters);
    setSnackbar({ open: true, message: 'Plano salvo com sucesso!', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Planejador de Grade Curricular
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar Disciplina
              </Typography>
              <TextField
                select
                fullWidth
                label="Disciplina"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="">Selecione uma disciplina</option>
                {mockSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </TextField>
              <TextField
                type="number"
                fullWidth
                label="Semestre"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
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
                <Box key={semester.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {`${semester.id}º Semestre`}
                  </Typography>
                  <List>
                    {semester.subjects.map((subject) => (
                      <ListItem key={subject.id}>
                        <ListItemText
                          primary={subject.name}
                          secondary={`Créditos: ${subject.credits}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveSubject(semester.id, subject.id)}
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

