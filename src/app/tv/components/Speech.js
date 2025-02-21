"use client";

export default function Speech() {
  const speakText = () => {
    const text = "Ana Paula";
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "pt-BR"; // Define a voz para português do Brasil
    speech.rate = 1; // Velocidade normal
    speech.pitch = 0.5; // Tom da voz
    window.speechSynthesis.speak(speech);
  };

  return (
    <button onClick={speakText} style={styles.button}>
      Falar Texto
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
};
