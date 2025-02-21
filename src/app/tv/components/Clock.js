"use client";
import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.clock}>
      {time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
  );
}

const styles = {
  clock: {
    fontSize: "6rem",
    fontWeight: "bold",
    backgroundColor: "rgb(62 132 197)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "10px",
    display: "inline-block",
    textAlign: "center",
  },
};
