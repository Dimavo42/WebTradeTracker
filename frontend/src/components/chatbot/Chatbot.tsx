import { useEffect, useRef, useState } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import styles from "./Chatbot.module.css";
import { useAppSelector } from "../../hooks/reduxHooks";
import { io,type Socket } from "socket.io-client";

export default function Chatbot() {
  const { isOpen, mode, setMode, loading, messages, error, sendUserMessage, toggleChatbot, clearMessages } =
    useChatbot();
  const [inputValue, setInputValue] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAppSelector(
      (state) => state.auth.isAuthenticated
    );
  const authState = useAppSelector(
      (state) => state.auth
    );
    

  // keep the newest message in view
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(inputValue);
    setInputValue("");
  };
  const socketRef = useRef<Socket | null>(null);
  useEffect(()=>{
    if (!isOpen || mode !== "admin" || !isAuthenticated || !authState.token) {
      return;
    }
    const socket = io("http://localhost:3001/chatbot/support",{
      auth:{token:authState.token},
      transports: ["websocket"],
      reconnection:false,
      });
      socketRef.current = socket;
      socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });
     socket.on("connect_error", (error) => {
    console.error("Connection failed:", error.message);
    });
    socket.on("disconnect", (reason) => {
    console.log("Disconnected:", reason);
  });
  socket.on("chat-message", (message) => {
    console.log("Received:", message);
  });
    return () =>{
      socket.disconnect();
      socket.removeAllListeners();
      socketRef.current = null;
    }

  },[isOpen, mode, isAuthenticated, authState.token]);


  const testMessageSocket = () => {
  const socket = socketRef.current;

  if (!socket?.connected) {
    console.log("Socket is not connected yet");
    return;
  }

  socket.emit("chat-message", {
    id: "1",
    text: "Hello",
  });
};

  return (
    <div className={styles.container}>
      {isOpen && (
        <section className={styles.panel} aria-label="Chatbot">
          <header className={styles.header}>
            {/* Left column: title with the mode buttons underneath */}
            <div className={styles.headerMain}>
              <span className={styles.title}>Chatbot</span>
              <div className={styles.headerMode} role="group" aria-label="Chat mode">
                {(["ai", "admin"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`${styles.modeButton} ${mode === m ? styles.modeActive : ""}`}
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    disabled={m === "admin" && !isAuthenticated}
                  >
                    {m === "ai" ? "AI" : "Admin"}
                  </button>
                )) }

              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.headerButton}
                onClick={clearMessages}
                disabled={messages.length === 0}
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.headerButton}
                onClick={toggleChatbot}
                aria-label="Close chatbot"
              >
                ✕
              </button>
            </div>
          </header>
          {mode === "ai" ? (<div className={styles.messageList} aria-live="polite">
            {messages.length === 0 && !loading && (
              <p className={styles.empty}>Ask me anything about your trades or stocks.</p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.sender === "user" ? styles.user : styles.bot}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className={`${styles.message} ${styles.bot}`}>Typing…</div>}
            {error && <div className={styles.error}>{error}</div>}

            <div ref={listEndRef} />
          </div>) :(<div>
            <button onClick={() => testMessageSocket()}>Connect To admin </button>
          </div>)} 
          

          <form className={styles.controls} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              aria-label="Message"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!inputValue.trim() || loading}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </section>
      )}


      <button
        type="button"
        className={styles.toggle}
        onClick={toggleChatbot}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
