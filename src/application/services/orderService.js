// camada de serviço para lógica de negócios relacionada a pedidos

const _orderRepository = require("../../infra/repositories/orderRepository");
const { toOrderDomain, toOrderUpdateDomain } = require("../dtos/orderDTO");
const { toOrderResponse } = require("../mappers/orderMapper");

// Cria um novo pedido — lança erro se já existir
const createOrder = async (body) => {
  const exists = await _orderRepository.orderExists(body.numeroPedido);
  if (exists) {
    const err = new Error(`Order: ${body.numeroPedido} already exists.`);
    err.statusCode = 409;
    throw err;
  }

  // Converte o DTO para o formato de domínio e salva usando o Repository
  const order = toOrderDomain(body);
  return _orderRepository.create(order);
};

// Busca um pedido pelo número — lança erro se não encontrar
const getOrderById = async (orderId) => {
  const order = await _orderRepository.getById(orderId);

  if (!order) {
    const err = new Error(`Order: ${orderId} not found.`);
    err.statusCode = 404;
    throw err;
  }

  return toOrderResponse(order);
};

// Lista todos os pedidos
const getAllOrders = async () => {
  const orders = await _orderRepository.getAll();
  return orders.map(toOrderResponse);
};

// Atualiza um pedido existente
const updateOrder = async (orderId, body) => {
  const exists = await _orderRepository.orderExists(orderId);

  if (!exists) {
    const err = new Error(`Order: ${orderId} not found.`);
    err.statusCode = 404;
    throw err;
  }

  // Converte o DTO para o formato de domínio e atualiza usando o Repository
  const order = toOrderUpdateDomain(orderId, body);
  const updated = await _orderRepository.update(orderId, order);

  // retorna o pedido atualizado no formato de resposta
  return toOrderResponse(updated);
};

// Deleta um pedido existente
const deleteOrder = async (orderId) => {
  const exists = await _orderRepository.orderExists(orderId);

  if (!exists) {
    const err = new Error(`Order: ${orderId} not found.`);
    err.statusCode = 404;
    throw err;
  }

  await _orderRepository.deleteById(orderId);
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
