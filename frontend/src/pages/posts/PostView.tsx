import {
    Box,
    Button,
    Container,
    Paper,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

interface Post {
  id: number;
  title: string;
  date: string;
  content: string;
}

const PostView: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the post data from an API
    // For this example, we'll use mock data
    const mockPost: Post = {
      id: Number(postId),
      title: "Prazo de entrega para TCC prorrogado",
      date: "12/01/2025",
      content: "O prazo para entrega do TCC foi estendido por mais duas semanas. Esta decisão foi tomada para dar aos alunos mais tempo para aprimorar seus trabalhos e garantir a qualidade das pesquisas apresentadas. Todos os orientadores foram notificados desta mudança e estão disponíveis para auxiliar os alunos neste período adicional."
    };
    setPost(mockPost);
  }, [postId]);

  if (!post) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          {post.title}
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Data: {post.date}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={() => navigate('/posts')}>
              Voltar para a Lista
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate(`/posts/edit/${post.id}`)}>
              Editar
            </Button>
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PostView;

