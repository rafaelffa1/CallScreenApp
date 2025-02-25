"use client";
import React from "react";
import styles from "../styles/EventList.module.css";
import { FaUser, FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("wss://websocket-server-odonto-production.up.railway.app");

interface EventProps {
  id: string;
  summary: string; // ✅ Adicionado para evitar o erro
  start: { dateTime?: string }; // Data pode ser opcional
  end: { dateTime?: string };
  location?: string;
  attendees?: { email: string }[];
}

const EventCard: React.FC<EventProps> = (event) => {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Conectado ao WebSocket Server com ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado do WebSocket");
    });
  }, []);


  if (!event) return <p>🚫 Nenhum evento disponível.</p>;

  const title = event?.summary || "Evento sem título";
  const startTime = event?.start?.dateTime
    ? new Date(event.start.dateTime).toLocaleString("pt-BR")
    : "Data não definida";
  const endTime = event?.end?.dateTime
    ? new Date(event.end.dateTime).toLocaleString("pt-BR")
    : "Data não definida";
  const location = event?.location || "Local não informado";
  const participants = Array.isArray(event?.attendees) ? event.attendees.map((attendee) => attendee.email) : [];

  const sendAlert = () => {
    const nextPatient = participants[0]; // Pegamos o primeiro participante como próximo paciente
    if (!nextPatient) return alert("Nenhum paciente disponível.");
    socket.emit("alertNextPatient", { name: nextPatient });
    alert(`📢 Alerta enviado: ${nextPatient} foi chamado!`);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>📢 Próximo Evento</h3>
      <div className={styles.details}>
        <p>🗓 <strong>{title}</strong></p>
        <p>🕒 <strong>Início:</strong> {startTime} - <strong>Término:</strong> {endTime}</p>
        <p>📍 <strong>Local:</strong> {location}</p>
        <p>👥 <strong>Participantes:</strong></p>
        <ul className={styles.participantList}>
          {participants.length > 0 ? (
            participants.map((participant, index) => (
              <li key={index} className={styles.participant}>
                <FaUser className={styles.icon} /> {participant}
              </li>
            ))
          ) : (
            <p>Sem participantes</p>
          )}
        </ul>
      </div>

      {/* Botão de Alerta */}
      <button className={styles.alertButton} onClick={sendAlert}>
        <FaBell className={styles.alertIcon} /> Alerta
      </button>
    </div>
  );
};

const EventList: React.FC<{ events: EventProps[] }> = ({ events }) => {
  return (
    <div className={styles.listContainer}>
      {events.map((event, index) => (
        <EventCard key={index} {...event} />
      ))}
    </div>
  );
};

export default EventList;
