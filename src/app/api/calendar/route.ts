import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
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
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}
