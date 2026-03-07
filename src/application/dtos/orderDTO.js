// Responsável por transformar o JSON de entrada (português) para o modelo de domínio (inglês)

const badRequest = (msg) => Object.assign(new Error(msg), { statusCode: 400 });

const toOrderDomain = (body) => {
  // Validações básicas — o service pode lançar erros de validação, que o controller vai transformar em respostas HTTP
  if (!body || typeof body !== "object")
    throw badRequest("Body da requisição inválido.");
  if (!body.numeroPedido) 
    throw badRequest("numeroPedido é obrigatório.");
  if (body.valorTotal === undefined || body.valorTotal === null)
    throw badRequest("valorTotal é obrigatório.");
  if (!body.dataCriacao) 
    throw badRequest("dataCriacao é obrigatório.");

  const creationDate = new Date(body.dataCriacao);
  if (Number.isNaN(creationDate.getTime()))
    throw badRequest("dataCriacao inválida. Use um date-time ISO.");
  if (!Array.isArray(body.items)) 
    throw badRequest("items deve ser um array.");

  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: body.items.map((item) => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
};

// DTO para atualização é similar, mas não permite atualizar o número do pedido (chave primária) e tem validações iguais  menos a de número do pedido
const toOrderUpdateDomain = (orderId, body) => {
  if (!body || typeof body !== "object") 
    throw badRequest("Body da requisição inválido.")
  if (body.valorTotal === undefined || body.valorTotal === null) 
    throw badRequest("valorTotal é obrigatório.")
  if (!body.dataCriacao) 
    throw badRequest("dataCriacao é obrigatório.")

  const creationDate = new Date(body.dataCriacao);
  if (Number.isNaN(creationDate.getTime())) 
    throw badRequest("dataCriacao inválida. Use um date-time ISO.")
  if (!Array.isArray(body.items)) 
    throw badRequest("items deve ser um array.")

  return {
    orderId, // não permite atualizar o número do pedido, pois é a chave primária
    value: Number(body.valorTotal),
    creationDate,
    items: body.items.map((item) => ({
      productId: parseInt(item.idItem, 10),
      quantity: Number(item.quantidadeItem),
      price: Number(item.valorItem),
    })),
  };
};



module.exports = { toOrderDomain, toOrderUpdateDomain };
