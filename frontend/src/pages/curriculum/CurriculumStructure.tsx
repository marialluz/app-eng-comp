import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Container,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface Subject {
  id: string;
  name: string;
  type: 'mandatory' | 'elective' | 'optional';
  credits: number;
  prerequisites: string[];
}

interface Semester {
  number: number;
  subjects: Subject[];
}

const mockCurriculum: Semester[] = [
  {
    number: 1,
    subjects: [
      { id: 'COMP101', name: 'Introdução à Computação', type: 'mandatory', credits: 4, prerequisites: [] },
      { id: 'MATH101', name: 'Cálculo I', type: 'mandatory', credits: 4, prerequisites: [] },
      { id: 'PHYS101', name: 'Física I', type: 'mandatory', credits: 4, prerequisites: [] },
    ]
  },
  {
    number: 2,
    subjects: [
      { id: 'COMP201', name: 'Estruturas de Dados', type: 'mandatory', credits: 4, prerequisites: ['COMP101'] },
      { id: 'MATH201', name: 'Cálculo II', type: 'mandatory', credits: 4, prerequisites: ['MATH101'] },
      { id: 'PHYS201', name: 'Física II', type: 'mandatory', credits: 4, prerequisites: ['PHYS101'] },
    ]
  },
  // Add more semesters as needed
];

const CurriculumStructure: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSemester, setExpandedSemester] = useState<number | false>(false);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSemester(isExpanded ? panel : false);
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/curriculum/${subjectId}`);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Estrutura Curricular - Engenharia de Computação
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          {mockCurriculum.map((semester) => (
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
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.id)}
                    sx={{
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': { borderBottom: 'none' },
                    }}
                    >
                    <ListItemText
                        primary={subject.name}
                        secondary={
                        <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                            {`Créditos: ${subject.credits}`}
                            </Typography>
                            {subject.prerequisites.length > 0 && (
                            <Typography component="span" variant="body2" color="text.secondary">
                                {` • Pré-requisitos: ${subject.prerequisites.join(', ')}`}
                            </Typography>
                            )}
                        </React.Fragment>
                        }
                    />
                    <Chip
                        label={
                        subject.type === 'mandatory'
                            ? 'Obrigatória'
                            : subject.type === 'elective'
                            ? 'Eletiva'
                            : 'Optativa'
                        }
                        color={
                        subject.type === 'mandatory'
                            ? 'primary'
                            : subject.type === 'elective'
                            ? 'secondary'
                            : 'default'
                        }
                        size="small"
                    />
                    </ListItemButton>
                ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/dashboard/student')}>
            Voltar para o Dashboard
          </Button>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CurriculumStructure;

