"use client";

import EventList from "./components/EventList";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home2() {
  const { data: session } = useSession();
  const [events2, setEvents] = useState([]);

  // useEffect(() => {
  //   fetch("/api/calendar")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.items) {
  //         setEvents(data.items);
  //         console.log('====================================');
  //         console.log(data.items);
  //         console.log('====================================');
  //       }
  //     })
  //     .catch((err) => console.error("Erro ao buscar eventos:", err));
  // }, []);

  const buttonGoogle = () => (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {!session ? (
        <>
          <h1>Faça login com Google</h1>
          <button onClick={() => signIn("google")}>🔑 Login</button>
        </>
      ) : (
        <>
          <h1>Bem-vindo, {session.user?.name}!</h1>
          <button onClick={() => signOut()}>🚪 Sair</button>
        </>
      )}
    </div>
  )

  const events = [
    {
      title: "Reunião com Cliente",
      startTime: "10:00",
      endTime: "11:00",
      location: "Google Meet",
      participants: ["Cliente X", "Theo"],
    },
    {
      title: "Sprint Review",
      startTime: "14:00",
      endTime: "15:00",
      location: "Microsoft Teams",
      participants: ["Equipe Dev", "PO", "Scrum Master"],
    },
    {
      title: "Planejamento de Produto",
      startTime: "16:00",
      endTime: "17:30",
      location: "Sala 01 - Escritório",
      participants: ["CEO", "PM", "Designer", "Dev Team"],
    },
    {
      title: "Call com Investidores",
      startTime: "18:00",
      endTime: "19:00",
      location: "Zoom",
      participants: ["Investidores A", "Financeiro", "CEO"],
    },
  ];

  return (
    <div>
      <img src='logo.png' alt="Logo" />
      <div style={{ display: "flex", alignItems: "flex-start", paddingTop: '2em', justifyContent: "center", height: "100vh", background: "#e3f2fd" }}>
        {buttonGoogle()}
        <EventList events={events} />
      </div>
    </div >
  );
}


