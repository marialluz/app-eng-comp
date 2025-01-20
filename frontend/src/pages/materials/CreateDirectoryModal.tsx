import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { NewDirFormData, newDirSchema } from "../../schemas/new-dir";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../config/api";
import { useMutation } from "@tanstack/react-query";
import { Subject } from "../../types/subject";

type Props = {
  open: boolean;
  subjects: Array<Subject>;
  handleClose: () => void;
};

export const CreateDirectoryModal = ({
  open,
  handleClose,
  subjects,
}: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<NewDirFormData>({
    resolver: zodResolver(newDirSchema),
  });

  const {
    mutate,
    isPending,
    reset: resetMutation,
  } = useMutation({
    mutationFn: async ({ subject }: { subject: string }) => {
      await api.post("/directory/", { subject });
    },
    onSuccess() {
      resetMutation();
      handleClose();
      reset();
    },
  });

  const onSubmit = handleSubmit(async (values) => mutate(values));

  const onClose = () => {
    if (isPending) return;

    return handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit,
        sx: { width: 340 },
      }}
    >
      <DialogTitle>Criar nova pasta</DialogTitle>
      <DialogContent>
        <FormControl
          sx={{ marginTop: 2 }}
          fullWidth
          error={!!errors.subject?.message}
        >
          <InputLabel id="subject-label">Disciplina</InputLabel>
          <Select
            labelId="subject-label"
            label="Disciplina"
            {...register("subject")}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.code} value={subject.code}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Criando..." : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
