import { Add, Folder, Upload } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';


const DirectoryList = () => {
  const navigate = useNavigate();
  const [directories] = useState([
    { id: '1', name: 'Matemática', filesCount: 5 },
    { id: '2', name: 'Física', filesCount: 3 },
    { id: '3', name: 'Programação', filesCount: 7 }
  ]);

  return (
    <MainLayout>
      <Button variant="outlined" onClick={() => navigate('/dashboard/student')} sx={{ mb: 3 }}>
        Voltar para o Dashboard
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box p={3}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link color="inherit" href="/dashboard/student">
              Dashboard
            </Link>
            <Typography color="text.primary">Materiais</Typography>
          </Breadcrumbs>
          <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => navigate('/materials/upload')}
            >
              Upload Arquivo
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Nova Pasta
            </Button>
          </Box>

          <Paper elevation={2}>
            <List>
              {directories.map((dir) => (
                <ListItem key={dir.id} component="li">
                  <ListItemButton onClick={() => navigate(`/materials/${dir.id}`)}>
                    <ListItemIcon>
                      <Folder color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={dir.name}
                      secondary={`${dir.filesCount} arquivo(s)`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DirectoryList;
