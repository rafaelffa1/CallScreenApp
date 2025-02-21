"use client";

import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Clock from './components/Clock';
import styles from './styles/tv.module.css';
import Image from "next/image";

const socket = io("http://localhost:3001"); // Certifique-se que o servidor está rodando

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
    }, 4000);
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
      <header className={styles.header}>
        <Image src='logo.png' alt="Logo" className={styles.logo} />
      </header>

      <main className={styles.main}>
        <section className={styles.twoColumnSection}>
          <div className={styles.column}>
            <section className={styles.videoSection}>
              <div className={styles.videoContainer}>
                <iframe
                  src="https://www.youtube.com/embed/7RqbDiAQayk?autoplay=1&mute=1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Apresentação em Vídeo"
                ></iframe>
              </div>
            </section>
          </div>

          <div className={styles.column}>
            <div className="text-center mt-4">
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <Clock />
              </div>
            </div>

            {
              nextPatient &&
              <div className="card text-center mt-10">
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                  <h1 style={{ fontSize: '100px' }}>{nextPatient}</h1>
                </div>
              </div>
            }

          </div>
        </section>
      </main>
    </div>
  );
}
