# 📦 Order Manager 

Este projeto é uma aplicação Angular desenvolvida para gerenciar pedidos de uma loja. O objetivo principal é demonstrar competências em arquitetura modular, gestão de estado com RxJS, validações de regras de negócio e boas práticas de desenvolvimento (Docker e Testes).

## 🚀 Funcionalidades

### Gestão de Pedidos
- **Listagem de Pedidos:** Visualização de todos os pedidos registrados.
- **Filtro por Status:** Possibilidade de filtrar pedidos por `ABERTO` ou `FECHADO` (Funcionalidade opcional implementada).
- **Criação de Pedidos:** Fluxo para iniciar um novo pedido vazio.

### Detalhes e Itens
- **Adicionar Produtos:** Inclusão de itens com validação de descrição (máx. 50 caracteres).
- **Remover Itens:** Exclusão de produtos de pedidos ainda abertos.
- **Fechamento de Pedido:** Regra de negócio que impede o fechamento de pedidos vazios ou a alteração de pedidos já fechados.

## 🛠️ Tecnologias Utilizadas

- **Angular 17+:** Utilizando componentes Standalone e Signals para controle de estado reativo.
- **RxJS:** Gerenciamento de fluxos assíncronos e simulação de chamadas de API com Observables.
- **TypeScript:** Tipagem estrita para maior segurança do código.
- **Docker & Docker Compose:** Containerização da aplicação.
- **Karma/Jasmine:** Suíte de testes unitários.

## 🐳 Executando com Docker (Recomendado)

A aplicação está totalmente dockerizada. O grande diferencial desta configuração é que o **build só é concluído se todos os testes passarem**, garantindo a integridade do código.

Para rodar o projeto via Docker, certifique-se de ter o Docker instalado e execute:

```bash
docker-compose up --build
