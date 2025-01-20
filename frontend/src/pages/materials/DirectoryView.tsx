import {
  CloudUploadOutlined,
  Delete,
  Description,
  Share,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../config/api";
import { Dir, DirFile } from "../../types/dir";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DirectoryView = () => {
  const { directoryId } = useParams<{ directoryId: string }>();
  const {
    mutate: uploadFile,
    isPending,
    reset,
  } = useMutation({
    mutationFn: async (file: File) => {
      console.log("mutation", file);
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);
      await api.post(`/directory/${directoryId}/file/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      reset();
    },
  });
  const navigate = useNavigate();
  const { data: dirData } = useQuery({
    queryKey: ["dir", directoryId],
    queryFn: async () => {
      const { data } = await api.get<Dir>(`/directory/${directoryId}`);
      return data;
    },
  });

  const { data: dirFiles } = useQuery({
    queryKey: ["dir", directoryId, "files"],
    queryFn: async () => {
      const { data } = await api.get<Array<DirFile>>(
        `/directory/${directoryId}/file/`
      );

      return data;
    },
  });

  return (
    <MainLayout>
      <Box p={3}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link color="inherit" href="/dashboard/student">
              Dashboard
            </Link>
            <Link color="inherit" href="/materials">
              Materiais
            </Link>
            <Typography color="text.primary">{dirData?.subject}</Typography>
          </Breadcrumbs>

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadOutlined />}
            disabled={isPending}
          >
            {isPending ? "Enviando..." : "Adicionar arquivo"}
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                if (!event.target.files?.length) return;
                uploadFile(event.target.files[0]);
              }}
              accept="application/pdf"
            />
          </Button>
        </Box>

        <Paper elevation={2}>
          <List>
            {!dirFiles?.length && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                Nenhum arquivo adicionado
              </Box>
            )}
            {dirFiles?.map((file) => (
              <ListItem key={file.id}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Link href={file.file} target="_blank">
                      {file.name}
                    </Link>
                  }
                  secondary={
                    file.created_at
                      ? new Date(file.created_at).toLocaleString()
                      : undefined
                  }
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
