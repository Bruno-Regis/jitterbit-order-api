const prisma = require("../../../utils/prisma");

// função para criar um pedido, utilizando o prisma para inserir os dados no banco de dados
const create = async (order) => {
  return await prisma.order.create({
    data: {
      orderId: order.orderId,
      value: order.value,
      creationDate: order.creationDate,
      items: {
        create: order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: true },
  });
};

// função para buscar um pedido por id, utilizando o prisma para consultar os dados no banco de dados
const getById = async (orderId) => {
  return await prisma.order.findUnique({
    where: { orderId },
    include: { items: true },
  });
};

// função para buscar todos os pedidos, utilizando o prisma para consultar os dados no banco de dados
const getAll = async () => {
  return await prisma.order.findMany({
    include: { items: true },
  });
};

const update = async (orderId, order) => {
  return await prisma.order.update({
    where: { orderId },
    data: {
      value: order.value,
      creationDate: order.creationDate,
      items: {
        deleteMany: {}, // remove os itens antigos
        create: order.items.map((i) => ({
          // cria os novos itens
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: true },
  });
};

// função para deletar um pedido por id, utilizando o prisma para remover os dados no banco de dados
const deleteById = async (orderId) => {
  return await prisma.order.delete({
    where: { orderId },
  });
};

// função para verificar se um pedido existe, utilizando o prisma para consultar os dados no banco de dados retorna booleano
const orderExists = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { orderId },
    select: { orderId: true },
  });

  return Boolean(order);
};

module.exports = { create, getById, getAll, update, deleteById, orderExists };
