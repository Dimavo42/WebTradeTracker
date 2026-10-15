import { useEffect, useRef, useState } from "react";
import { useChatbot } from "../../hooks/useChatbot";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const { isOpen, loading, messages, error, sendUserMessage, toggleChatbot, clearMessages } =
    useChatbot();
  const [inputValue, setInputValue] = useState("");
  const listEndRef = useRef<HTMLDivElement>(null);

  // keep the newest message in view
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <section className={styles.panel} aria-label="Chatbot">
          <header className={styles.header}>
            <span className={styles.title}>Chatbot</span>
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

          <div className={styles.messageList} aria-live="polite">
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
          </div>

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
