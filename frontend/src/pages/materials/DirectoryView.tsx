import { Delete, Description, Share } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const DirectoryView = () => {
  const navigate = useNavigate();
  const [files] = useState([
    { id: '1', name: 'Aula 1.pdf', size: '2.5 MB', date: '2025-01-10' },
    { id: '2', name: 'Exercícios.docx', size: '1.8 MB', date: '2025-01-12' },
    { id: '3', name: 'Trabalho Final.pdf', size: '3.2 MB', date: '2025-01-13' }
  ]);

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
          <Typography color="text.primary">Pasta Atual</Typography>
        </Breadcrumbs>

        <Paper elevation={2}>
          <List>
            {files.map((file) => (
              <ListItem key={file.id}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText 
                  primary={file.name}
                  secondary={`${file.size} • ${file.date}`}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="share"
                    onClick={() => navigate(`/materials/share/${file.id}`)}
                    sx={{ mr: 1 }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default DirectoryView;