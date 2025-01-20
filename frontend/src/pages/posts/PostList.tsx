import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { api } from '../../config/api';
import MainLayout from '../../layouts/MainLayout';
import { useUserStore } from '../../stores/user';

interface PostRequest {
  file: File | null; // Arquivo anexado (se houver)
  text: string; // Texto da postagem
}

const PostList: React.FC = () => {
  const BASE_URL = "http://localhost:8000";
  const { is_teacher } = useUserStore(); // Verifica se o usuário é professor
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle do dialog
  const [newPost, setNewPost] = useState<PostRequest>({ file: null, text: '' }); // Dados da nova postagem
  const [posts, setPosts] = useState<any[]>([]); // Lista de postagens
  const [error, setError] = useState<string>(''); // Mensagem de erro
  const [showError, setShowError] = useState(false); // Exibe a mensagem de erro

  // Função para buscar as postagens
  const fetchPosts = async () => {
    try {
      const response = await api.get('/post/');
      setPosts(response.data as PostRequest[]);
    } catch (error) {
      console.error('Erro ao buscar postagens:', error);
      setError('Erro ao buscar postagens');
      setShowError(true);
    }
  };

  // Função para criar uma nova postagem
  const handleCreatePost = async () => {
    if (!newPost.text) {
      setError('Texto da postagem é obrigatório');
      setShowError(true);
      return;
    }

    const formData = new FormData();
    formData.append('text', newPost.text);

    if (newPost.file) {
      formData.append('file', newPost.file); // Adiciona o arquivo, se houver
    }

    try {
      await api.post('/post/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Adicionar token de autenticação, se necessário
        },
      });

      setIsDialogOpen(false); // Fechar o dialog
      setNewPost({ file: null, text: '' }); // Limpar dados do formulário
      fetchPosts(); // Atualizar lista de postagens

    } catch (error) {
      console.error('Erro ao criar a postagem:', error);
      setError('Erro ao criar a postagem');
      setShowError(true);
    }
  };

  // Abrir o Dialog de criação de postagem
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // Fechar o Dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Lidar com a mudança de texto da postagem
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost({ ...newPost, text: event.target.value });
  };

  // Lidar com a mudança do arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({ ...newPost, file: event.target.files[0] });
    }
  };

  // Carregar as postagens ao montar o componente
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <MainLayout>
    <Paper sx={{ padding: 2 }}>
      {/* Botão para criar nova postagem, visível apenas para professores */}
      {is_teacher && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          Criar Nova Notícia
        </Button>
      )}

      {/* Exibição da lista de postagens */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {post.text}
                </Typography>
                {post.file && (
                  <Typography variant="body2" color="text.secondary">
                    <a href={`${BASE_URL}${post.file}`} target="_blank" rel="noopener noreferrer">
                      Ver Anexo
                    </a>
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Criado por: {post.created_by.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {new Date(post.created_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">Nenhuma postagem encontrada.</Typography>
        )}
      </div>

      {/* Dialog para criar nova postagem */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Criar Nova Notícia</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Box>
            <TextField
              autoFocus
              margin="dense"
              label="Texto da Postagem"
              required
              fullWidth
              value={newPost.text}
              onChange={handleTextChange}
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              {/* Substituindo o input de arquivo pelo botão de upload estilizado */}
              <TextField
                type="file"
                inputProps={{ accept: "image/*,application/pdf,application/msword" }}
                onChange={handleFileChange}
                sx={{
                  display: 'none', // Esconde o input original
                }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{ width: '100%' }}
                >
                  Anexar Arquivo
                </Button>
              </label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCreatePost} color="primary" variant="contained">
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exibição de erro, caso haja */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
    </MainLayout>
  );
};

export default PostList;
