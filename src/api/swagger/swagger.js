// Configuração da documentação automática da API

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders API',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos - Desafio Jitterbit',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        // Configuração do esquema de autenticação JWT
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Informe o token JWT obtido em POST /auth/login",
        },
      },
      schemas: {
        // Schema do body de entrada (português — como o cliente envia)
        OrderInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            numeroPedido: {
              type: 'string',
              example: 'v10089015vdb-01',
            },
            valorTotal: {
              type: 'number',
              example: 10000,
            },
            dataCriacao: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-19T12:24:11.5299601+00:00',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  idItem: { type: 'string', example: '2434' },
                  quantidadeItem: { type: 'integer', example: 1 },
                  valorItem: { type: 'number', example: 1000 },
                },
              },
            },
          },
        },
        // Schema da resposta (inglês — como salva no banco)
        OrderResponse: {
          type: 'object',
          properties: {
            orderId: { type: 'string', example: 'v10089015vdb-01' },
            value: { type: 'number', example: 10000 },
            creationDate: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'integer', example: 2434 },
                  quantity: { type: 'integer', example: 1 },
                  price: { type: 'number', example: 1000 }
                },
              },
            },
          },
        },
        // Schema específico para update — sem numeroPedido
        OrderUpdateInput: {
          type: 'object',
          required: ['valorTotal', 'dataCriacao', 'items'],
          properties: {
            valorTotal: {
              type: 'number',
              example: 10000,
            },
            dataCriacao: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-19T12:24:11.5299601+00:00',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  idItem: { type: 'string', example: '2434' },
                  quantidadeItem: { type: 'integer', example: 1 },
                  valorItem: { type: 'number', example: 1000 },
                },
              },
            },
          },
        },
        // Schema de erro
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Pedido não encontrado.' },
          },
        },
      },
    },
    // Aplica autenticação JWT globalmente em todas as rotas
    security: [{ bearerAuth: [] }],
  },
  // Onde o swagger-jsdoc vai procurar as anotações dos endpoints
  apis: ['./src/api/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = setupSwagger