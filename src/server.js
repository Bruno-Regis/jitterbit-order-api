const express = require('express');
const app = express();
const port = 3000;

// endpoint health para verificar se o servidor está rodando ok
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});