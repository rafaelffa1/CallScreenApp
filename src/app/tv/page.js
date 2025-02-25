"use client";

import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Clock from './components/Clock';
import styles from './styles/tv.module.css';
import Image from "next/image";

const socket = io("wss://websocket-server-odonto-production.up.railway.app");

export default function Home() {
  const [nextPatient, setNextPatient] = useState()

  useEffect(() => {
    socket.on("newAlert", (data) => {
      setNextPatient(data.name);
      speakText(data.name)
      delayedAction()
    });

    return () => {
      socket.off("newAlert");
    };
  }, []);

  const delayedAction = () => {
    setTimeout(() => {
      setNextPatient('')
    }, 10000);
  }

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "pt-BR";
    speech.rate = 0.7;
    speech.pitch = 0.5;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className={styles.container}>
      {/* Logotipo */}
      <header className={styles.header}>
        <img src="/logo.png" alt="Odonto Fácil" className={styles.logo} />
      </header>

      {/* Relógio no canto superior direito */}
      <div className={styles.clock}>
        <Clock />
      </div>

      {/* Vídeo */}
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <iframe
            src="https://www.youtube.com/embed/7RqbDiAQayk?autoplay=1&mute=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Vídeo de Atendimento"
            className={styles.videoIframe}
          ></iframe>
        </div>

        {nextPatient && <div className={styles.banner}>🔔 {nextPatient}</div>}
      </main>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>Odonto Fácil - Atendimento com qualidade</p>
      </footer>

    </div>
  );
}
