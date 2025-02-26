"use client";

import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Clock from './components/Clock';
import styles from './styles/tv.module.css';
import Image from "next/image";

const socket = io("wss://websocket-server-odonto-production.up.railway.app");

export default function Home() {
  const [nextPatient, setNextPatient] = useState()
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    socket.on("newAlert", (data) => {
      setNextPatient(data.name);
      speakText(data.name)
      delayedAction()
    });

    socket.on("newVideo", (data) => {
      setVideoUrl(data);
    });

    return () => {
      socket.off("newAlert");
      socket.off("newVideo");
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
        <Image src='/logo.png' alt="Logo" width={200} height={100} className={styles.logo} />
      </header>

      {/* Relógio no canto superior direito */}
      <div className={styles.clock}>
        <Clock />
      </div>

      {/* Vídeo */}
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          {
            videoUrl ?
              <iframe
                src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vídeo de Atendimento"
                className={styles.videoIframe}
              ></iframe>
              :
              <Image src='/logo.png' alt="Logo" width={300} height={500} className={styles.logo} />
          }

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
