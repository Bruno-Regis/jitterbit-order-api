// COntroller responsável por autenticar o usuário e retornar o token JWT

const jwt = require("jsonwebtoken");

// Para esse desafio, usamos um usuário fixo hardcoded
// Em produção, você buscaria o usuário no banco de dados
const MOCK_USER = {
  username: "admin",
  password: "admin123",
};

// POST /auth/login
const login = (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Valida se os campos foram enviados
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username e password são obrigatórios." });
    }

    // Valida as credenciais
    if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
      return res
        .status(401)
        .json({ message: "Credenciais inválidas." });
    }

    // Gera o token JWT — equivalente a um cookie de sessão, mas stateless
    const token = jwt.sign(
      { username }, // payload — dados que ficam dentro do token
      process.env.JWT_SECRET, // chave secreta para assinar
      { expiresIn: "8h" } // token expira em 8 horas
    );

    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
    //return res.status(500).json({ message: "Erro interno ao autenticar.", error: error.message });
  }
};

module.exports = { login };