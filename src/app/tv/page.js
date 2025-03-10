"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useCallback, Suspense } from "react";
import { io } from "socket.io-client";
import Clock from "./components/Clock";
import styles from "./styles/tv.module.css";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

const socket = io("wss://websocket-server-odonto-production.up.railway.app");
const NUM_REPEAT_SPEAK = 3;

export default function Home() {
  return (
    <Suspense fallback={<p>Carregando TV...</p>}>
      <TVContent />
    </Suspense>
  );
}

function TVContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomCode, setRoomCode] = useState(
    searchParams.get("codigosala") || ""
  );
  const [showModal, setShowModal] = useState(!roomCode);
  const [nextPatient, setNextPatient] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (roomCode) {
      socket.emit("joinRoom", roomCode); // Conecta a sala específica
      console.log(`✅ Entrando na sala: ${roomCode}`);
    }
  }, [roomCode]);

  const speakText = useCallback((text) => {
    for (let i = 0; i < NUM_REPEAT_SPEAK; i++) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "pt-BR";
      speech.rate = 0.7;
      speech.pitch = 0.5;
      window.speechSynthesis.speak(speech);
    }
    setTimeout(() => setNextPatient(""), 40000);
  }, []);

  useEffect(() => {
    socket.on("newAlert", (data) => {
      setNextPatient(data.name);
      speakText(data.name);
    });

    socket.on("newVideo", (data) => {
      setVideoUrl(data);
    });

    return () => {
      socket.off("newAlert");
      socket.off("newVideo");
    };
  }, [speakText]);

  const handleSetRoomCode = () => {
    if (roomCode.trim() === "") {
      alert("O código da sala é obrigatório!");
      return;
    }
    router.push(`?codigosala=${roomCode}`);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Modal para solicitar código da sala */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Digite o código da sala</h2>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Código da sala"
              className={styles.input}
            />
            <button className={styles.button} onClick={handleSetRoomCode}>
              Entrar
            </button>
          </div>
        </div>
      )}

      {/* Logotipo */}
      <header className={styles.header}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={100}
          className={styles.logo}
        />
      </header>

      {/* Relógio no canto superior direito */}
      <div className={styles.clock}>
        <Clock />
      </div>

      {/* Vídeo */}
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          {videoUrl ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Vídeo de Atendimento"
              className={styles.videoIframe}
            ></iframe>
          ) : (
            <Image
              src="/logo.png"
              alt="Logo"
              width={300}
              height={500}
              className={styles.logo}
            />
          )}
        </div>

        {nextPatient !== "" && (
          <div className={styles.banner}>🔔 {nextPatient}</div>
        )}
      </main>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>Odonto Fácil - Atendimento com qualidade</p>
      </footer>
    </div>
  );
}
