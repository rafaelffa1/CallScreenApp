import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token não enviado" }, { status: 401 });
  }

  const accessToken = authHeader.split(" ")[1];

  console.log("AccessToken recebido na API:", accessToken); // 🔍 Log para depuração

  if (!accessToken) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}


