const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexões de qualquer origem
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("📡 Cliente conectado ao WebSocket");

  socket.on("alertNextPatient", (data) => {
    console.log(`📢 Paciente chamado: ${data.name}`);
    io.emit("newAlert", data); // Envia para todas as telas conectadas
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado");
  });
});

server.listen(3001, () => {
  console.log("🚀 Servidor WebSocket rodando na porta 3001");
});
