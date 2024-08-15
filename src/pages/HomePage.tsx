import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Date } from "../components/Date";
import AddIcon from "@mui/icons-material/Add";
import { ITodo } from "../types/main";
import { ListTodo } from "../components/ListTodo";
import dayjs, { Dayjs } from "dayjs";
import { useFetchTodos } from "../hook/useFetchTodos";
import { todoSchema } from "../util/schemas";
import Erro from "../components/Erro";
import { organizeTodosByDate } from "../util/orderByDate";
import { Load } from "../components/Load";

export const HomePage: React.FC = () => {
  const { todos, setTodos, loading, error, addTodo, updateTodo } =
    useFetchTodos();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [validationError, setValidationError] = useState<{
    field: string;
    message: string;
  } | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<ITodo[]>([]);
  console.log(todos);

  const handleToggleComplete = (index: number) => {
    // Atualiza o estado local imediatamente
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );

    // Adiciona a tarefa atualizada ao estado de atualizações pendentes
    setPendingUpdates((prevUpdates) => {
      const updatedTodo = {
        ...todos[index],
        completed: !todos[index].completed,
      };
      return [
        ...prevUpdates.filter((todo) => todo.id !== updatedTodo.id),
        updatedTodo,
      ];
    });

    // Limpa o timeout anterior, se existir
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Define um novo timeout para salvar no banco de dados após 5 segundos
    const newTimeoutId = setTimeout(async () => {
      // Salva todas as atualizações pendentes no banco de dados
      setPendingUpdates((prevUpdates) => {
        prevUpdates.forEach(async (todo) => {
          console.log("fiz update" + todo);
          await updateTodo(todo.id ?? "", todo);
        });
        return [];
      });
    }, 5000);

    setTimeoutId(newTimeoutId);
  };

  const handleAddTodo = async (): Promise<void> => {
    const newTodo: Omit<ITodo, "id"> = {
      title,
      description,
      date: date ? date.format("YYYY-MM-DD") : "",
      completed: false,
    };

    const validation = todoSchema.safeParse(newTodo);

    if (!validation.success) {
      const error = validation.error.errors[0];

      setValidationError({
        field: error.path[0] as string,
        message: error.message,
      });
      return;
    }

    await addTodo(newTodo);
    setTitle("");
    setDescription("");
    setDate(dayjs("2022-04-17"));
    setValidationError(null);
  };

  if (error && error.includes("Erro no servidor")) {
    return <Erro message={error} />;
  }

  // Organizar os todos por data antes de renderizar
  const sortedTodos = organizeTodosByDate(todos);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          "@media (min-width: 600px)": {
            padding: "2rem",
          },
        }}
        data-testid="home-page"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "1rem",
            "@media (min-width: 600px)": {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          }}
          data-testid="input-container"
        >
          <TextField
            label="Título"
            fullWidth
            variant="outlined"
            sx={{
              marginBottom: "1rem",
              "@media (min-width: 600px)": {
                marginBottom: "0",
                marginRight: "1rem",
              },
            }}
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
          fullWidth
          variant="outlined"
          sx={{
            marginBottom: "1rem",
          }}
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
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          data-testid="button-container"
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginY: "1rem",
              maxWidth: "12.5rem",
            }}
            startIcon={<AddIcon />}
            aria-label="Adicionar Tarefa"
            onClick={handleAddTodo}
            disabled={loading}
            data-testid="add-button"
          >
            Adicionar
          </Button>
        </Box>

        {loading && <Load data-testid="loading" />}
        {error && <p data-testid="erro">{error}</p>}
        {todos.length !== 0 && (
          <ListTodo
            todos={sortedTodos}
            handleToggleComplete={handleToggleComplete}
          />
        )}
      </Box>
    </>
  );
};
