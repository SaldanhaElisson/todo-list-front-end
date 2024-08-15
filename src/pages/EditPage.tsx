import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

import { Date } from "../components/Date";
import Erro from "../components/Erro";
import { useFetchTodos } from "../hook/useFetchTodos";
import { todoSchema } from "../util/schemas";
import { useTodoStore } from "../Store/todoStore";
import { Load } from "../components/Load";

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const todosDidGet = useTodoStore((state) => state.todos);
  const addTodoStore = useTodoStore((state) => state.addTodoStore);
  const {
    loading,
    error,
    updateTodo,
    deleteTodo,
    getTodoById,
    todos,
    setTodos,
  } = useFetchTodos();
  const fetchedTodo = getTodoById(id ?? "", todosDidGet);

  const [title, setTitle] = useState<string>(fetchedTodo?.title ?? "");
  const [description, setDescription] = useState<string>(
    fetchedTodo?.description ?? ""
  );
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [validationError, setValidationError] = useState<{
    field: string;
    message: string;
  } | null>(null);

  useLayoutEffect(() => {
    addTodoStore(todos);
  }, [todos, addTodoStore]);

  useEffect(() => {
    if (fetchedTodo) {
      setTitle(fetchedTodo.title);
      setDescription(fetchedTodo.description);
      setDate(fetchedTodo.date ? dayjs(fetchedTodo.date) : dayjs());
    }
  }, [fetchedTodo]);

  const handleSave = async () => {
    const updatedTodo = {
      title,
      description,
      date: date?.format("YYYY-MM-DD"),
      completed: false,
    };

    const validation = todoSchema.safeParse(updatedTodo);

    if (!validation.success) {
      const error = validation.error.errors[0];
      setValidationError({
        field: error.path[0] as string,
        message: error.message,
      });
      return;
    }

    await updateTodo(id ?? "", updatedTodo);
    navigate("/");
  };

  const handleDelete = async () => {
    await deleteTodo(id ?? "");
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    navigate("/");
  };

  if (loading) {
    return <Load />;
  }

  if (error && error.includes("Erro no servidor")) {
    return <Erro message={error} showBackButton />;
  }

  return (
    <>
      <Button
        onClick={() => navigate("/")}
        variant="text"
        startIcon={<ArrowBackIcon />}
        sx={{ marginBottom: "1rem" }}
        aria-label="Voltar"
      >
        Voltar
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          "@media (min-width:600px)": { flexDirection: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flex: 1,
          }}
        >
          <TextField
            label="Título"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Título"
            error={validationError?.field === "title"}
            helperText={
              validationError?.field === "title" ? validationError.message : ""
            }
            data-testid="title-input"
          />
          <Date setValue={setDate} value={date} />
        </Box>
        <TextField
          label="Descrição"
          multiline
          rows={2}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Descrição"
          error={validationError?.field === "description"}
          helperText={
            validationError?.field === "description"
              ? validationError.message
              : ""
          }
          data-testid="description-input"
          sx={{ "@media (min-width:600px)": { marginTop: 0, flex: 1 } }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          alignItems: "center",
          width: "100%",
          flexDirection: "column",
          "@media (min-width:600px)": { flexDirection: "row" },
        }}
      >
        <Button
          variant="contained"
          fullWidth
          color="error"
          sx={{ marginY: "1rem", maxWidth: "200px" }}
          startIcon={<DeleteIcon />}
          aria-label="Deletar Tarefa"
          onClick={handleDelete}
        >
          Deletar
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="success"
          sx={{ marginY: "1rem", maxWidth: "200px" }}
          startIcon={<SaveIcon />}
          aria-label="Salvar Tarefa"
          onClick={handleSave}
        >
          Salvar
        </Button>
      </Box>
    </>
  );
};
