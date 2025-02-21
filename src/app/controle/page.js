import EventList from "./components/EventList";

export default function Home2() {
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
        <EventList events={events} />
      </div>
    </div >
  );
}


