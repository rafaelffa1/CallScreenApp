"use client";

import EventList from "./components/EventList";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "./styles/Home.module.css";
import { FaSignOutAlt, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function Home2() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCalendarEvents = async () => {

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

      console.log('====================================');
      console.log(data);
      console.log('====================================');

      if (response.ok) {
        setEvents(data.items || []);
      } else {
        setError(data.error || "Erro desconhecido");
      }
    } catch (err) {
      setError("Erro ao buscar eventos");
      alert(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Image src='/logo.png' alt="Logo" width={200} height={100} />
        <nav className={styles.menu}>
          <button className={styles.menuButton} onClick={() => signIn("google")}>
            <FaUser className={styles.icon} /> Login
          </button>
          <button className={styles.menuButton} onClick={fetchCalendarEvents}>
            <FaCalendarAlt className={styles.icon} /> Buscar Eventos
          </button>
          <button className={styles.logoutButton} onClick={() => signOut()}>
            <FaSignOutAlt className={styles.icon} /> Sair
          </button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <p className={styles.welcome}>Bem-vindo, {session?.user?.name}!</p>
        </header>

        {loading && <p>🔄 Carregando eventos...</p>}
        {error && <p style={{ color: "red" }}>❌ Erro: {error}</p>}

        <section className={styles.eventList}>
          {events.length > 0 ? (
            <EventList event={events} />
          ) : (
            !loading && <p>🚫 Nenhum evento encontrado.</p>
          )}
        </section>
      </main>
    </div>
  );
}


