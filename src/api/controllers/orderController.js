// Camada responsável por receber as requisições HTTP e devolver as respostas
// Não tem regra de negócio — só delega para o service e trata o HTTP

const orderService = require("../../application/services/orderService");

// POST /order
// Cria um novo pedido
const createOrder = async (req, res, next) => {
  try {
    const response = await orderService.createOrder(req.body);
    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
};

// GET /order/:orderId
// Busca um pedido pelo número
const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

// GET /order/list
// Lista todos os pedidos
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

// PUT /order/:orderId
// Atualiza um pedido existente
const updateOrder = async (req, res, next) => {
  try {
    const order = await orderService.updateOrder(req.params.orderId, req.body);
    return res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

// DELETE /order/:orderId
// Deleta um pedido
const deleteOrder = async (req, res, next) => {
  try {
    await orderService.deleteOrder(req.params.orderId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
