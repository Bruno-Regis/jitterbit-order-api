const toOrderResponse = (order) => {
  return {
    orderId: order.orderId,
    value: order.value,
    creationDate: order.creationDate,
    items: (order.items || []).map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      price: i.price,
    })),
  };
};

module.exports = { toOrderResponse };