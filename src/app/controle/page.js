"use client";

import EventList from "./components/EventList";
import { useState, useEffect, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./styles/Home.module.css";
import { FaSignOutAlt, FaCalendarAlt, FaUser, FaVideo } from "react-icons/fa";
import { io } from "socket.io-client";
import {
  GenerateRandomHash,
  getHashFromSession,
  saveHashToSession,
  removeHashFromSession,
} from "../ultils/ultils";

const socket = io("wss://websocket-server-odonto-production.up.railway.app");

export default function Home2() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const fetchCalendarEvents = useCallback(async () => {
    if (!session?.accessToken) {
      setError("Token não encontrado na sessão.");
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const response = await fetch("/api/calendar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`, // ✅ Passa o token no header
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEvents(data.items || []);
      } else {
        setError(data.error || "Erro desconhecido");
      }
    } catch (err) {
      setError("Erro ao buscar eventos");
      alert(err);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (session) {
      let hash_room = "";
      fetchCalendarEvents();

      if (getHashFromSession() === null) {
        hash_room = GenerateRandomHash();
        saveHashToSession(hash_room);
        setRoomCode(hash_room);
      }

      if (socket) {
        socket.on("connect", () => {
          console.log("✅ Conectado ao WebSocket Server com ID:", socket.id);
        });

        socket.emit("joinRoom", hash_room);

        socket.on("disconnect", () => {
          console.log("❌ Desconectado do WebSocket");
        });

        return () => {
          socket.off("connect");
          socket.off("disconnect");
        };
      }
    }
  }, [session]);

  const sendVideoToTV = () => {
    if (!videoUrl.trim()) {
      alert("Por favor, insira uma URL válida do YouTube.");
      return;
    }
    socket?.emit("videoYoutube", { roomId: roomCode, videoUrl: videoUrl });
    alert(`📢 Video enviado: ${videoUrl}!`);
  };

  const logOff = () => {
    signOut();
    removeHashFromSession();
  };

  const redirectToCallScreen = () => {
    const baseUrl = window.location.origin;
    const tvUrl = `${baseUrl}/tv?codigosala=${roomCode}`;
    window.open(tvUrl, "_blank");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Image
          src="/logo.png"
          alt="Logo"
          style={{ marginBottom: 30 }}
          width={200}
          height={100}
        />
        <nav className={styles.menu}>
          {!session && (
            <button
              className={styles.menuButton}
              onClick={() => signIn("google")}
            >
              <FaUser className={styles.icon} /> Login
            </button>
          )}

          {session && (
            <div>
              <button
                className={styles.menuButton}
                onClick={fetchCalendarEvents}
              >
                <FaCalendarAlt className={styles.icon} /> Buscar Eventos
              </button>
              <button
                className={styles.menuButton}
                onClick={() => setShowModal(true)}
              >
                <FaVideo className={styles.icon} /> Vídeo TV
              </button>
              <button
                className={styles.menuButton}
                onClick={() => redirectToCallScreen()}
              >
                <FaVideo className={styles.icon} /> Tela de Chamada
              </button>
              <button className={styles.logoutButton} onClick={() => logOff()}>
                <FaSignOutAlt className={styles.icon} /> Sair
              </button>
            </div>
          )}
        </nav>
      </aside>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Enviar Vídeo para TV</h3>
            <input
              type="text"
              placeholder="Cole a URL do vídeo do YouTube"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalButtons}>
              <button className={styles.sendButton} onClick={sendVideoToTV}>
                Enviar
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <p className={styles.welcome}>
            Bem-vindo, {session?.user?.name}! Sala: {roomCode}
          </p>
        </header>

        {loading && <p>🔄 Carregando eventos...</p>}
        {error && <p style={{ color: "red" }}>❌ Erro: {error}</p>}

        <section className={styles.eventList}>
          {events.length > 0 ? (
            <EventList events={events} socket={socket} roomCode={roomCode} />
          ) : !session ? (
            <p>
              Por favor, faça login para acessar e visualizar seus eventos do
              calendário.
            </p>
          ) : (
            !session && !loading && <p>🚫 Nenhum evento encontrado.</p>
          )}
        </section>
      </main>
    </div>
  );
}
