// Intercepta todas as requisições e valida o token JWT

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Pega o header Authorization — formato esperado: "Bearer TOKEN"
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  // Separa o "Bearer" do token em si
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Formato do token inválido. Use: Bearer TOKEN" });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Injeta o usuário decodificado na requisição — disponível nos controllers
    req.user = decoded;

    // Chama o próximo middleware ou controller
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado. Faça login novamente." });
    }
    return res.status(401).json({ message: "Token inválido." });
  }
};

module.exports = authMiddleware;