import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { HomePage } from "../pages/HomePage";
import dayjs from "dayjs";
import { MemoryRouter } from "react-router-dom";
import { ListTodo } from "../components/ListTodo";
import { Load } from "../components/Load";
import Erro from "../components/Erro";
import { useTodoStore } from "../Store/todoStore";
import { ITodo } from "../types/main";
import { act } from "react";
vi.mock("../hook/useFetchTodos");
import { organizeTodosByDate } from "../util/orderByDate";

beforeEach(() => {
  vi.spyOn(window.history, "back").mockImplementation(() => {});
  vi.mock("../hook/useFetchTodos", () => ({
    useFetchTodos: () => ({
      todos: [
        {
          id: "1",
          title: "Nova Tarefa",
          description: "Descrição da nova tarefa",
          date: dayjs().format("YYYY-MM-DD"),
          completed: false,
        },
      ],
      setTodos: vi.fn(),
      loading: false,
      error: null,
      addTodo: vi.fn(),
      updateTodo: vi.fn(),
      getTodoById: vi.fn().mockReturnValue({
        id: "1",
        title: "Nova Tarefa",
        description: "Descrição da nova tarefa",
        date: dayjs().format("YYYY-MM-DD"),
      }),
    }),
  }));
});

describe("HomePage", () => {
  it("deve renderizar a HomePage corretamente", () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("verificar se os campos estão na página e podem ser alterados", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const titleInput = screen
      .getByTestId("title-input")
      ?.querySelector("input");
    const descriptionInput = screen
      .getByTestId("description-input")
      ?.querySelector("input");

    // Verificar e alterar o campo de título
    fireEvent.change(titleInput, { target: { value: "Novo Título" } });
    expect(titleInput.value).toBe("Novo Título");
  });
});

const mockTodos = [
  {
    id: "1",
    title: "Tarefa 1",
    description: "Descrição da Tarefa 1",
    date: dayjs().format("YYYY-MM-DD"),
    completed: false,
  },
  {
    id: "2",
    title: "Tarefa 2",
    description: "Descrição da Tarefa 2",
    date: dayjs().subtract(1, "day").format("YYYY-MM-DD"), // Data passada
    completed: true,
  },
];

const handleToggleComplete = vi.fn();

describe("ListTodo", () => {
  it("deve renderizar a lista de todos corretamente", () => {
    render(
      <MemoryRouter>
        <ListTodo
          todos={mockTodos}
          handleToggleComplete={handleToggleComplete}
        />
      </MemoryRouter>
    );

    // Verificar se os itens da lista estão presentes
    const todoItems = screen.getAllByRole("listitem");
    expect(todoItems).toHaveLength(mockTodos.length);

    // Verificar se os títulos estão corretos
    expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
    expect(screen.getByText("Tarefa 2")).toBeInTheDocument();

    // Verificar se as descrições estão corretas
    expect(screen.getByText("Descrição da Tarefa 1")).toBeInTheDocument();
    expect(screen.getByText("Descrição da Tarefa 2")).toBeInTheDocument();

    // Verificar se as datas estão corretas
    expect(screen.getByText(dayjs().format("YYYY-MM-DD"))).toBeInTheDocument();
    expect(
      screen.getByText(dayjs().subtract(1, "day").format("YYYY-MM-DD"))
    ).toBeInTheDocument();
  });

  it("deve chamar handleToggleComplete ao clicar no checkbox", () => {
    render(
      <MemoryRouter>
        <ListTodo
          todos={mockTodos}
          handleToggleComplete={handleToggleComplete}
        />
      </MemoryRouter>
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(handleToggleComplete).toHaveBeenCalledWith(0);
  });
});

describe("Load", () => {
  it("deve renderizar o componente Load corretamente", () => {
    render(<Load />);

    // Verificar se o CircularProgress está presente
    const circularProgress = screen.getByRole("progressbar");
    expect(circularProgress).toBeInTheDocument();

    // Verificar se o Box está presente
    const box = screen.getByTestId("box-container");
    expect(box).toBeInTheDocument();
  });
});

describe("Erro", () => {
  it("deve renderizar a mensagem de erro corretamente", () => {
    const message = "Este é um erro de teste";
    render(<Erro message={message} />);

    // Verificar se a mensagem de erro está presente
    expect(screen.getByText("Ocorreu um erro")).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("deve renderizar o botão de voltar quando showBackButton é true", () => {
    const message = "Este é um erro de teste";
    render(<Erro message={message} showBackButton={true} />);

    // Verificar se o botão de voltar está presente
    const backButton = screen.getByRole("button", { name: /voltar/i });
    expect(backButton).toBeInTheDocument();

    // Simular clique no botão de voltar
    fireEvent.click(backButton);
    // Verificar se a função de voltar foi chamada
    expect(window.history.back).toHaveBeenCalled();
  });

  it("não deve renderizar o botão de voltar quando showBackButton é false", () => {
    const message = "Este é um erro de teste";
    render(<Erro message={message} showBackButton={false} />);

    // Verificar se o botão de voltar não está presente
    const backButton = screen.queryByRole("button", { name: /voltar/i });
    expect(backButton).not.toBeInTheDocument();
  });
});

describe("useTodoStore", () => {
  it("should add new todos to the store", () => {
    const { result } = renderHook(() => useTodoStore());

    const newTodos: ITodo[] = [
      {
        id: "1",
        title: "Nova Tarefa",
        description: "Descrição da nova tarefa",
        date: "2024-08-14",
        completed: false,
      },
    ];

    act(() => {
      result.current.addTodoStore(newTodos);
    });

    expect(result.current.todos).toEqual(newTodos);
  });
});

describe("organizeTodosByDate", () => {
  it("deve organizar os todos por data em ordem ascendente", () => {
    const todos: ITodo[] = [
      {
        id: "1",
        title: "Tarefa 1",
        description: "Descrição da Tarefa 1",
        date: "2024-08-15",
        completed: false,
      },
      {
        id: "2",
        title: "Tarefa 2",
        description: "Descrição da Tarefa 2",
        date: "2024-08-14",
        completed: true,
      },
      {
        id: "3",
        title: "Tarefa 3",
        description: "Descrição da Tarefa 3",
        date: "2024-08-16",
        completed: false,
      },
    ];

    const sortedTodos = organizeTodosByDate(todos);

    expect(sortedTodos[0].date).toBe("2024-08-14");
    expect(sortedTodos[1].date).toBe("2024-08-15");
    expect(sortedTodos[2].date).toBe("2024-08-16");
  });
});
