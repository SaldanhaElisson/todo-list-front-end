# React + TypeScript + Vite

# Meu Projeto

Este é um projeto de exemplo que utiliza React e json-server para criar uma aplicação web simples.

## Descrição

Este projeto é uma aplicação web que permite gerenciar uma lista de tarefas. A aplicação é construída com React para o frontend e json-server para simular uma API RESTful no backend.

## Tecnologias Utilizadas

- React
- json-server
- Docker

## Pré-requisitos

Antes de começar, certifique-se de ter o Node na versão 10.8.2.

## Como Rodar o Projeto

- Clone este repositório em sua máquina local

- Depois execute o comando para executar o json-server

```bash
  npm run json-server --watch db.json --port 3001
```

- Depois execute o seguinte comando para rodar em ambiente de desenvolvimento

```bash
    npm run dev
```

Depois disso basta acessa o software no seguinte endereço

### Testes

Para rodar os testes execute o seguinte comando

```bash
  npm run test
```

## Arquitetura

- **tests**: Contém os arquivos de teste para verificar se o código está funcionando corretamente.
- **snapshots**: Armazena arquivos de snapshot usados para testes de interface, garantindo que a UI não tenha mudanças inesperadas.
- **assets**: Inclui arquivos estáticos como imagens, fontes e outros recursos que são usados na aplicação.\*
  components: Contém componentes reutilizáveis do React que são usados em várias partes da aplicação.
- **hooks**: Guarda hooks personalizados do React, que encapsulam lógica reutilizável.
- **pages**: Contém os componentes de página, cada um representando uma rota diferente na aplicação.
- **store**: Relacionado ao gerenciamento de estado, como Redux ou outro sistema de gerenciamento de estado.
- **styles**: Inclui arquivos de estilo, como CSS ou SCSS, usados para estilizar a aplicação.
- **types**: Armazena definições de tipos TypeScript ou PropTypes para validação de tipos no JavaScript.
- **utils**: Contém funções utilitárias que são usadas em várias partes da aplicação.
