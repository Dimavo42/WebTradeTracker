import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useSupportChat } from "../../hooks/useSupportChat";
import { callSupport, getMySupportRequest } from "../../api/supportApi";
import SupportConversation from "../support/SupportConversation";
import styles from "./Chatbot.module.css";

// "Admin" tab of the chatbot: call an admin, wait, then chat live.
// Only rendered for logged-in users.
export default function SupportChat() {
  const token = useAppSelector((state) => state.auth.token);
  const myEmail = useAppSelector((state) => state.auth.email);
  const chat = useSupportChat({ token, enabled: !!token });
  const { join } = chat;

  const [calling, setCalling] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);

  // Already waiting from before (page reload / reopened panel)? Rejoin that conversation.
  useEffect(() => {
    if (!token) return;
    getMySupportRequest(token)
      .then((existing) => {
        if (existing) join(existing.conversationId);
      })
      .catch(() => {
        /* not waiting — show the call button */
      });
  }, [token, join]);

  const handleCall = async () => {
    if (!token) return;
    setCalling(true);
    setCallError(null);
    try {
      chat.reset();
      const request = await callSupport(token);
      chat.join(request.conversationId);
    } catch (err) {
      setCallError(err instanceof Error ? err.message : "Couldn't call an admin");
    } finally {
      setCalling(false);
    }
  };

  // The admin "responded" once a message arrives from someone other than me
  const adminResponded = chat.messages.some((m) => m.from !== myEmail);
  const error = callError ?? chat.error;

  if (chat.closed) {
    return (
      <div className={styles.supportState}>
        <p>The support chat has ended.</p>
        <button type="button" className={styles.supportButton} onClick={handleCall} disabled={calling}>
          Call an admin again
        </button>
      </div>
    );
  }

  if (!chat.conversationId) {
    return (
      <div className={styles.supportState}>
        <p>Need a human? An admin can help you with your account or trades.</p>
        <button type="button" className={styles.supportButton} onClick={handleCall} disabled={calling}>
          {calling ? "Calling…" : "Call an admin"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }

  return (
    <>
      <div className={styles.supportBar}>
        <span>
          {adminResponded ? "Connected to an admin" : "⏳ Waiting for an admin to respond…"}
        </span>
        <button type="button" className={styles.supportEnd} onClick={chat.close}>
          {adminResponded ? "End chat" : "Cancel"}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <SupportConversation
        messages={chat.messages}
        myEmail={myEmail}
        canSend={adminResponded}
        onSend={chat.send}
        emptyText="You're in the queue. You can type once an admin replies."
      />
    </>
  );
}
