# Orders API — Desafio Técnico Jitterbit

API REST para gerenciamento de pedidos, desenvolvida como parte do processo seletivo da Jitterbit para a vaga de System Analyst Jr.

## 📽️ Demonstração

[![Demonstração da API](https://img.youtube.com/vi/I3EkC5Yh9WA/0.jpg)](https://youtu.be/I3EkC5Yh9WA)

> 🔗 https://www.youtube.com/watch?v=I3EkC5Yh9WA

---

## Tecnologias

- **Node.js** + **Express** — servidor HTTP
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL** — banco de dados relacional
- **Docker** — containerização do banco de dados
- **JWT (jsonwebtoken)** — autenticação
- **Swagger (swagger-jsdoc + swagger-ui-express)** — documentação
- **dotenv** — variáveis de ambiente
- **nodemon** — hot reload em desenvolvimento

---

## Arquitetura

O projeto foi desenvolvido seguindo os princípios de **Clean Architecture**, com separação clara de responsabilidades:

```
src/
  api/
    controllers/        → recebe req/res, delega para o service
    middlewares/        → autenticação JWT
    routes/             → mapeamento de URLs
    swagger/            → configuração da documentação
  application/
    dtos/               → transformação e validação do input (PT-BR → domínio)
    mappers/            → transformação do output (domínio → resposta)
    services/           → regras de negócio
  infra/
    repositories/       → acesso ao banco via Prisma
    utils/
        prisma.js       → instância centralizada do PrismaClient
prisma/
  schema.prisma         → definição das tabelas
  migrations/           → histórico de migrations
```

---

## Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/Bruno-Regis/jitterbit-order-api.git
cd jitterbit-order-api
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```dotenv
DATABASE_URL="postgresql://admin:admin@localhost:5432/ordersdb?schema=public"
JWT_SECRET="minha_chave_secreta"
PORT=3000
```

### 3. Suba o banco de dados

> **Windows:** abra o Docker Desktop e aguarde o Engine ficar “running”.  
> Se `docker info` mostrar erro na seção **Server**, o Docker ainda não iniciou.

```bash
docker-compose up -d
```

### 4. Instale as dependências

```bash
npm install
```

### 5. Execute as migrations

```bash
npx prisma migrate deploy
```

### 6. Inicie o servidor

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

### 7. Sem Docker (opcional)
Se você não puder usar Docker, aponte `DATABASE_URL` para um PostgreSQL já disponível e execute:
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

---

## Documentação

A documentação completa da API está disponível via Swagger em:

```
http://localhost:3000/docs
```

---

## Autenticação

A API utiliza autenticação JWT.

- **Público:** `POST /auth/login`
- **Protegido (requer JWT):** todas as rotas em `/order/*`

### 1. Faça login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Use o token retornado

Adicione o header em todas as requisições:

```
Authorization: Bearer SEU_TOKEN
```

No Swagger, clique no botão **Authorize 🔒** e cole o token.

---

## Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Autentica e retorna token JWT |

### Orders
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/order` | Cria um novo pedido |
| GET | `/order/list` | Lista todos os pedidos |
| GET | `/order/:orderId` | Busca pedido pelo número |
| PUT | `/order/:orderId` | Atualiza um pedido |
| DELETE | `/order/:orderId` | Deleta um pedido |

---

## Mapeamento de campos

A API realiza a transformação dos campos do formato de entrada (PT-BR) para o modelo de domínio (EN):

| Input (PT-BR) | Domínio (EN) |
|---------------|--------------|
| `numeroPedido` | `orderId` |
| `valorTotal` | `value` |
| `dataCriacao` | `creationDate` |
| `idItem` | `productId` |
| `quantidadeItem` | `quantity` |
| `valorItem` | `price` |

### Exemplo de requisição

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer SEU_TOKEN' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

### Exemplo de resposta

```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

---

## 👨‍💻 Desenvolvedor

**Bruno Regis Borges da Costa Netto**
