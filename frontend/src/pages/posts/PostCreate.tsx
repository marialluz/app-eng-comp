
//so pode criar se for prof, tem que ajeitar

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const PostCreate: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log('Submitting new post:', { title, content });
    // After successful submission, navigate back to the post list
    navigate('/posts');
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Criar Nova Notícia
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Conteúdo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={() => navigate('/posts')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Publicar
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default PostCreate;

