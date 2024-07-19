import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import styles from "./App.module.css";

const App = () => {
  const socket = useMemo(() => io("https://chat-application-api-wheat.vercel.app"), []);

  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = { text: message, senderId: socketId }; 
    socket.emit("message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]); 
    setMessage(""); 
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("user connected");
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]); 
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.off("connect");
      socket.off("receive-message");
      socket.off("welcome");
      socket.disconnect();
    };
  }, [socket]); 

  return (
    <div className={styles.container} maxWidth="sm">
      <div className={styles.logoImg}></div>
      <div className={styles.messageContainer}>
        {messages.map((m, i) => (
          <p
            className={m.senderId === socketId ? styles.messageRight : styles.messageLeft}
            key={i}
          >
            {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          value={message}
          className={styles.messageInput}
          onChange={(e) => setMessage(e.target.value)}
          id="messageInput"
        />
        <button type="submit" className={styles.sendBtn}><IoMdSend /></button>
      </form>
    </div>
  );
};

export default App;
