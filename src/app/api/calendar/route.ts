import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}
