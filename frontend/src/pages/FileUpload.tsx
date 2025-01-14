import { Upload } from '@mui/icons-material';
import {
    Box,
    Breadcrumbs,
    Button,
    FormControl,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const navigate = useNavigate();
  const [directory, setDirectory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica de upload aqui
    navigate('/materials');
  };

  return (
    <Box p={3}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard/student">
          Dashboard
        </Link>
        <Link color="inherit" href="/materials">
          Materiais
        </Link>
        <Typography color="text.primary">Upload</Typography>
      </Breadcrumbs>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload de Arquivo
        </Typography>

        <form onSubmit={handleUpload}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Pasta</InputLabel>
            <Select
              value={directory}
              label="Pasta"
              onChange={(e) => setDirectory(e.target.value)}
              required
            >
              <MenuItem value="matematica">Matemática</MenuItem>
              <MenuItem value="fisica">Física</MenuItem>
              <MenuItem value="programacao">Programação</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Selecionar Arquivo
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>

          {file && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Arquivo selecionado: {file.name}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            startIcon={<Upload />}
            fullWidth
          >
            Fazer Upload
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default FileUpload;