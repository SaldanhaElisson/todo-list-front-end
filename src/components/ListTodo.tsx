import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ITodo } from "../types/main";
import dayjs from "dayjs";

interface Iprops {
  todos: Array<ITodo>;
  handleToggleComplete: (index: number) => void;
}

export const ListTodo: React.FC<Iprops> = ({ todos, handleToggleComplete }) => {
  // Função auxiliar para verificar se a data do todo já passou
  const isDatePassed = (date: string): boolean => {
    return dayjs(date).isBefore(dayjs(), "day");
  };

  return (
    <List
      sx={{
        width: "100%",
      }}
      data-testid="lista-todo"
    >
      {todos.map((todo, index) => (
        <ListItem
          key={todo.id}
          sx={{
            marginBottom: "1rem",
            backgroundColor: todo.completed
              ? "lightgray"
              : isDatePassed(todo.date)
              ? "#F05D5E"
              : "#D7EC98",
            borderRadius: "5px",
          }}
          aria-labelledby={`todo-title-${todo.id}`}
        >
          <Checkbox
            edge="start"
            checked={!!todo.completed}
            onChange={() => handleToggleComplete(index)}
            tabIndex={-1}
            disableRipple
            inputProps={{
              "aria-labelledby": `todo-title-${todo.id}`,
            }}
          />
          <Link
            to={`/todo/${todo.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
            aria-label={`Ver detalhes da tarefa ${todo.title}`}
          >
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  component="div"
                  color={"textSecondary"}
                  id={`todo-title-${todo.id}`}
                >
                  {todo.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body1" component="span">
                    {todo.description}
                  </Typography>
                  <br />
                  <Typography variant="body2" component="span">
                    {todo.date}
                  </Typography>
                </>
              }
              sx={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            />
          </Link>
        </ListItem>
      ))}
    </List>
  );
};
