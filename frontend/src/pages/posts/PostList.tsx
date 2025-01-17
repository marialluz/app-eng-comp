import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface Post {
  id: number;
  title: string;
  date: string;
  summary: string;
}

const PostList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the posts from an API
    // For this example, we'll use mock data
    const mockPosts: Post[] = [
      { id: 1, title: "Prazo de entrega para TCC prorrogado", date: "12/01/2025", summary: "O prazo para entrega do TCC foi estendido por mais duas semanas." },
      { id: 2, title: "Novo calendário de provas divulgado", date: "11/01/2025", summary: "O novo calendário de provas para o semestre atual já está disponível." },
      { id: 3, title: "Palestra sobre Inteligência Artificial", date: "10/01/2025", summary: "Na próxima semana, teremos uma palestra sobre os avanços recentes em IA." },
      { id: 4, title: "Inscrições abertas para monitoria", date: "09/01/2025", summary: "As inscrições para monitoria nas disciplinas do próximo semestre estão abertas." },
      { id: 5, title: "Manutenção programada nos laboratórios", date: "08/01/2025", summary: "Os laboratórios de informática estarão fechados para manutenção no próximo fim de semana." },
    ];
    setPosts(mockPosts);
  }, []);

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <MainLayout>
      <Button variant="outlined" onClick={() => navigate('/dashboard/student')}>
        Voltar para o Dashboard
      </Button>
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            Notícias
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/posts/create')}>
            Criar Nova Notícia
          </Button>
        </Box>
        <Paper elevation={3}>
          <List>
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                <ListItemButton
                  alignItems="flex-start"
                  onClick={() => handlePostClick(post.id)}
                >
                  <ListItemText
                    primary={post.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {post.date}
                        </Typography>
                        {" — " + post.summary}
                      </React.Fragment>
                    }
                  />
                </ListItemButton>
                {index < posts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PostList;

