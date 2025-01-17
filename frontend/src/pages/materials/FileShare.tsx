import { Send } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const FileShare = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleShare = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica de compartilhamento aqui
    navigate('/materials');
  };

  const handleAddRecipient = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setRecipients([...recipients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDelete = (recipientToDelete: string) => {
    setRecipients(recipients.filter(recipient => recipient !== recipientToDelete));
  };

  return (
    <MainLayout>
      <Box p={3}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link color="inherit" href="/dashboard/student">
            Dashboard
          </Link>
          <Link color="inherit" href="/materials">
            Materiais
          </Link>
          <Typography color="text.primary">Compartilhar</Typography>
        </Breadcrumbs>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Compartilhar Arquivo
          </Typography>

          <form onSubmit={handleShare}>
            <TextField
              fullWidth
              label="Email do destinatário"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleAddRecipient}
              sx={{ mb: 2 }}
              helperText="Pressione Enter para adicionar mais destinatários"
            />

            <Box sx={{ mb: 2 }}>
              {recipients.map((recipient) => (
                <Chip
                  key={recipient}
                  label={recipient}
                  onDelete={() => handleDelete(recipient)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              fullWidth
              disabled={recipients.length === 0}
            >
              Compartilhar
            </Button>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default FileShare;