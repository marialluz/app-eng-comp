import { Box, Button, Container, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../config/api";
import MainLayout from "../../layouts/MainLayout";

const StyledNode: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "5px",
      borderRadius: "8px",
      display: "inline-block",
      border: "1px solid #1976d2",
      cursor: "pointer"
    }}
  >
    {children}
  </div>
);

interface Subject {
  code: string;
  name: string;
  period: string | number;
  prerequisites: string[];
}

const PreRequisites: React.FC = () => {
  const { subjectCode } = useParams<{ subjectCode: string }>();
  const navigate = useNavigate();
  const [subjectsMap, setSubjectsMap] = useState<Map<string, Subject>>(new Map());
  const [rootSubject, setRootSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!subjectCode) return;

      setLoading(true);
      try {
        // Primeiro, buscar a disciplina principal
        const mainSubjectResponse = await api.get(`/subject/${subjectCode}`);
        const mainSubject = mainSubjectResponse.data as Subject;
        
        // Depois, buscar os pré-requisitos
        const prereqsResponse = await api.get(`/subject/${subjectCode}/prerequisites/?deep=true`);
        const prerequisites = prereqsResponse.data as Subject[];
        
        console.log("Main subject:", mainSubject);
        console.log("Prerequisites:", prerequisites);
        
        // Criar o mapa com todos os subjects
        const newSubjectsMap = new Map();
        
        // Adicionar primeiro a disciplina principal
        newSubjectsMap.set(mainSubject.code, mainSubject);
        
        // Adicionar os pré-requisitos
        prerequisites.forEach(subject => {
          newSubjectsMap.set(subject.code, subject);
        });
        
        console.log("Final map:", Array.from(newSubjectsMap.entries()));
        
        setSubjectsMap(newSubjectsMap);
        setRootSubject(mainSubject);
      } catch (error) {
        console.error("Erro ao carregar os pré-requisitos:", error);
        setRootSubject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectCode]);

  const renderTree = (subject: Subject): React.ReactNode => {
    if (!subject) return null;

    return (
      <TreeNode
        label={
          <StyledNode onClick={() => navigate(`/curriculum/${subject.code}`)}>
            {subject.name} ({subject.code})
          </StyledNode>
        }
      >
        {subject.prerequisites && subject.prerequisites.length > 0 ? (
          subject.prerequisites.map((prereqCode) => {
            const prereq = subjectsMap.get(prereqCode);
            return prereq ? renderTree(prereq) : null;
          })
        ) : (
          <TreeNode 
            label={
              <StyledNode onClick={() => {}}>
                Nenhum pré-requisito
              </StyledNode>
            }
          />
        )}
      </TreeNode>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
          <Typography>Carregando...</Typography>
        </Container>
      </MainLayout>
    );
  }

  if (!rootSubject) {
    return (
      <MainLayout>
        <Container maxWidth="lg">
          <Typography>Disciplina não encontrada (Código: {subjectCode})</Typography>
          <Typography variant="body2" color="textSecondary">
            Subjects disponíveis: {Array.from(subjectsMap.keys()).join(", ")}
          </Typography>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'start', gap: 2}} >
        <Button
          variant="outlined"
           onClick={() => navigate(`/curriculum/${subjectCode}`)}
        >
           Voltar para Detalhes da Disciplina
        </Button>
        <Button
           variant="contained"
           color="primary"
           onClick={() => navigate("/curriculum")}
        >
          Ver Estrutura Curricular Completa
        </Button>
      </Box>
      <Container maxWidth="lg" >
        <Typography variant="h4" gutterBottom>
          Árvore de Pré-requisitos: {rootSubject.name}
        </Typography>
        <Paper elevation={3}>
          <Box sx={{ p: 2 }}>
            <Tree
              lineWidth="2px"
              lineColor="#bbb"
              lineBorderRadius="10px"
              label={<div>Árvore de Pré-requisitos</div>}
            >
              {renderTree(rootSubject)}
            </Tree>
          </Box>
        </Paper>
        
      </Container>
    </MainLayout>
  );
};

export default PreRequisites;