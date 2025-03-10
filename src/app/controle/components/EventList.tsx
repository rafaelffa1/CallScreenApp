"use client";
import React from "react";
import styles from "../styles/EventList.module.css";
import { FaUser, FaBell } from "react-icons/fa";
import { Socket } from "socket.io-client";

interface EventProps {
  summary: string; // ✅ Adicionado para evitar o erro
  start: { dateTime?: string }; // Data pode ser opcional
  end: { dateTime?: string };
  location?: string;
  attendees?: { email: string }[];
  socket?: Socket;
  roomCode: string;
}

interface EventListProps {
  events: EventProps[];
  socket?: Socket;
  roomCode: string;
}

const EventCard: React.FC<EventProps> = ({
  summary,
  start,
  end,
  location,
  attendees,
  socket,
  roomCode,
}) => {
  if (!event) return <p>🚫 Nenhum evento disponível.</p>;

  const title = summary || "Evento sem título";
  const startTime = start?.dateTime
    ? new Date(start.dateTime).toLocaleString("pt-BR")
    : "Data não definida";
  const endTime = end?.dateTime
    ? new Date(end.dateTime).toLocaleString("pt-BR")
    : "Data não definida";
  const locationParam = location || "Local não informado";
  const participants = Array.isArray(attendees)
    ? attendees.map((attendee) => attendee.email)
    : [];

  const sendAlert = () => {
    const nextPatient = title; // Pegamos o primeiro participante como próximo paciente
    if (!nextPatient) return alert("Nenhum paciente disponível.");
    socket?.emit("alertNextPatient", { roomId: roomCode, name: nextPatient });
    alert(`📢 Alerta enviado: ${nextPatient} foi chamado!`);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.header}>📢 Próximo Evento</h3>
      <div className={styles.details}>
        <p>
          🗓 <strong>{title}</strong>
        </p>
        <p>
          🕒 <strong>Início:</strong> {startTime} - <strong>Término:</strong>{" "}
          {endTime}
        </p>
        <p>
          📍 <strong>Local:</strong> {locationParam}
        </p>
        <p>
          👥 <strong>Participantes:</strong>
        </p>
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

const EventList: React.FC<EventListProps> = ({ events, socket, roomCode }) => {
  return (
    <div className={styles.listContainer}>
      {events.map((event, index) => (
        <EventCard key={index} {...event} socket={socket} roomCode={roomCode} />
      ))}
    </div>
  );
};

export default EventList;
