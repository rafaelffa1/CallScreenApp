import { Server } from "socket.io";
import { NextResponse } from "next/server";

export async function GET(req) {
  if (!(global).io) {
    const io = new Server(3000, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
      console.log("📡 Cliente conectado ao WebSocket.");

      socket.on("alertNextPatient", (data) => {
        console.log(`📢 Paciente chamado: ${data.name}`);
        io.emit("newAlert", data); // Envia para todas as telas conectadas
      });
    });

    (global).io = io;
  }

  return NextResponse.json({ message: "Socket.io Server is running" });
}
