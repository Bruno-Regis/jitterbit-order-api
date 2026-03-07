require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const setupSwagger = require("./api/swagger/swagger");
setupSwagger(app);

const orderRoutes = require("./api/routes/orderRoutes");
const authRoutes = require("./api/routes/authRoutes");
const authMiddleware = require("./api/middlewares/authMiddleware");

app.use("/auth", authRoutes);
app.use("/order", authMiddleware, orderRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = status === 500 ? "Erro interno do servidor." : err.message;
  res.status(status).json({ message });
});

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});

module.exports = app;
