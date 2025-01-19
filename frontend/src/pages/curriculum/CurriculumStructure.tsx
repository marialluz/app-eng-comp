import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api';
import MainLayout from '../../layouts/MainLayout';
import { useUserStore } from '../../stores/user';

interface Subject {
  id: string;
  name: string;
  prerequisites: Subject[];
  code: string;
  period: string;
}

interface Semester {
  number: number;
  subjects: Subject[];
}

const CurriculumStructure: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSemester, setExpandedSemester] = useState<number | false>(false);
  const [curriculum, setCurriculum] = useState<Semester[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    period: '',
    prerequisites: ''
  });
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);
  
  const { is_teacher } = useUserStore();

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subject/');
      const subjects = response.data as Subject[];
      
      const organizedCurriculum: Semester[] = [];
      subjects.forEach((subject: Subject) => {
        const semesterNum = parseInt(subject.period);
        let semester = organizedCurriculum.find(s => s.number === semesterNum);
        if (!semester) {
          semester = { number: semesterNum, subjects: [] };
          organizedCurriculum.push(semester);
        }
        semester.subjects.push(subject);
      });
      organizedCurriculum.sort((a, b) => a.number - b.number);
      setCurriculum(organizedCurriculum);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Erro ao buscar disciplinas');
      setShowError(true);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    try {
      // Validação básica
      if (!newSubject.code || !newSubject.name || !newSubject.period) {
        setError('Por favor, preencha código, nome e período da disciplina');
        setShowError(true);
        return;
      }

      const requestData = {
        code: newSubject.code.trim(),
        name: newSubject.name.trim(),
        period: newSubject.period,
        prerequisites: newSubject.prerequisites ? 
          newSubject.prerequisites.split(',').map(p => p.trim()).filter(p => p) : 
          []
      };

      await api.post('/subject/', requestData);
      
      setIsDialogOpen(false);
      // Limpar o formulário
      setNewSubject({
        code: '',
        name: '',
        period: '',
        prerequisites: ''
      });
      // Atualizar a lista de disciplinas
      fetchSubjects();
      
    } catch (error: any) {
      console.error('Error adding subject:', error);
      setError(error.response?.data?.detail || 'Erro ao adicionar disciplina');
      setShowError(true);
    }
  };

  const handleChange = (panel: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSemester(isExpanded ? panel : false);
  };

  const handleSubjectClick = (subjectCode: string) => {
    navigate(`/curriculum/${subjectCode}`);
  };

  return (
    <MainLayout>
      <Button variant="outlined" onClick={() => navigate(is_teacher ? '/dashboard/teacher' : '/dashboard/student')}>
        Voltar para o Dashboard
      </Button>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Estrutura Curricular - Engenharia de Computação
        </Typography>
        
        {is_teacher && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setIsDialogOpen(true)}
            sx={{ mb: 2 }}
          >
            Adicionar Disciplina
          </Button>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          {curriculum.map((semester) => (
            <Accordion
              key={semester.number}
              expanded={expandedSemester === semester.number}
              onChange={handleChange(semester.number)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{`${semester.number}º Semestre`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {semester.subjects.map((subject) => (
                    <ListItemButton
                      key={subject.code}
                      onClick={() => handleSubjectClick(subject.code)}
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <ListItemText
                        primary={`${subject.code} - ${subject.name}`}
                        secondary={
                          <React.Fragment>
                            {subject.prerequisites.length > 0 && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                {` • Pré-requisitos: ${subject.prerequisites.join(', ')}`}
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Adicionar Nova Disciplina</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Código da Disciplina"
              required
              fullWidth
              value={newSubject.code}
              onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
              helperText="Ex: ECT3101"
            />
            <TextField
              margin="dense"
              label="Nome da Disciplina"
              required
              fullWidth
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Período"
              required
              fullWidth
              type="string"
              value={newSubject.period}
              onChange={(e) => setNewSubject({ ...newSubject, period: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Pré-requisitos (separados por vírgula)"
              fullWidth
              value={newSubject.prerequisites}
              onChange={(e) => setNewSubject({ ...newSubject, prerequisites: e.target.value })}
              helperText="Ex: ECT3101, ECT3102"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddSubject}>Adicionar</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showError}
          autoHideDuration={6000}
          onClose={() => setShowError(false)}
        >
          <Alert 
            onClose={() => setShowError(false)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </MainLayout>
  );
};

export default CurriculumStructure;