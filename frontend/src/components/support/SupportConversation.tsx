import { useEffect, useRef, useState } from "react";
import type { SupportMessage } from "../../types/support";
import styles from "./SupportConversation.module.css";

type Props = {
  messages: SupportMessage[];
  myEmail: string | null;
  canSend: boolean;
  onSend: (text: string) => void;
  emptyText: string;
  placeholder?: string;
};

// Message list + input for a live support chat (used by the chatbot and the admin page)
export default function SupportConversation({
  messages,
  myEmail,
  canSend,
  onSend,
  emptyText,
  placeholder = "Type your message...",
}: Props) {
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.list} aria-live="polite">
        {messages.length === 0 && <p className={styles.empty}>{emptyText}</p>}

        {messages.map((msg, index) => {
          const mine = msg.from === myEmail;
          return (
            <div key={index} className={`${styles.message} ${mine ? styles.mine : styles.theirs}`}>
              {!mine && <span className={styles.from}>{msg.from}</span>}
              {msg.text}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form className={styles.controls} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder={canSend ? placeholder : "Waiting…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!canSend}
          aria-label="Message"
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!canSend || !text.trim()}
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
