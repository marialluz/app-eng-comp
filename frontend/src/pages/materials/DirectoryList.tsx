import { Add, Folder, Upload } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/api";
import { CreateDirectoryModal } from "./CreateDirectoryModal";
import { Subject } from "../../types/subject";
import { Dir } from "../../types/dir";

const DirectoryList = () => {
  const navigate = useNavigate();

  const [isCreateDirectoryOpen, setIsCreateDirectoryOpen] = useState(false);

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data: responseData } = await api.get<Array<Subject>>("/subject");
      return responseData;
    },
  });

  const { data: directories } = useQuery({
    queryKey: ["directories"],
    queryFn: async () => {
      const { data: responseData } = await api.get<Array<Dir>>("/directory");
      return responseData;
    },
  });

  const toggleCreateDirectory = () => {
    setIsCreateDirectoryOpen(!isCreateDirectoryOpen);
  };

  return (
    <MainLayout>
      <CreateDirectoryModal
        open={isCreateDirectoryOpen}
        subjects={subjects ?? []}
        handleClose={toggleCreateDirectory}
      />

      <Button
        variant="outlined"
        onClick={() => navigate("/dashboard/student")}
        sx={{ mb: 3 }}
      >
        Voltar para o Dashboard
      </Button>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box p={3}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Typography variant="h4">Materiais</Typography>
          </Breadcrumbs>
          <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => navigate("/materials/upload")}
            >
              Upload Arquivo
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={toggleCreateDirectory}
            >
              Nova Pasta
            </Button>
          </Box>

          <Paper elevation={2}>
            <List>
              {directories?.map((dir) => (
                <ListItem key={dir.id} component="li">
                  <ListItemButton
                    onClick={() => navigate(`/materials/${dir.id}`)}
                  >
                    <ListItemIcon>
                      <Folder color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={dir.subject} />
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
