import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { useSupportChat } from "../hooks/useSupportChat";
import { getWaitingSupport } from "../api/supportApi";
import SupportConversation from "../components/support/SupportConversation";
import type { SupportRequest } from "../types/support";
import styles from "./AdminSupportPage.module.css";

// Admin area: everyone waiting for support, and a live chat with the one you open.
export default function AdminSupportPage() {
  const token = useAppSelector((state) => state.auth.token);
  const myEmail = useAppSelector((state) => state.auth.email);

  const [waiting, setWaiting] = useState<SupportRequest[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SupportRequest | null>(null);

  const loadQueue = useCallback(async () => {
    if (!token) return;
    try {
      setWaiting(await getWaitingSupport(token));
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load the queue");
    }
  }, [token]);

  // The socket tells us whenever someone calls or closes support -> refetch the list
  const chat = useSupportChat({ token, enabled: !!token, onQueueChanged: loadQueue });

  // First load of the queue
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    getWaitingSupport(token)
      .then((list) => {
        if (!cancelled) setWaiting(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load the queue");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const openChat = (request: SupportRequest) => {
    setSelected(request);
    chat.join(request.conversationId);
  };

  const closeSelected = () => {
    setSelected(null);
    chat.reset();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Support requests</h2>

      <div className={styles.layout}>
        <aside className={styles.queue}>
          <div className={styles.queueHeader}>
            <span>Waiting ({waiting.length})</span>
            <span className={chat.connected ? styles.online : styles.offline}>
              {chat.connected ? "● Live" : "● Offline"}
            </span>
          </div>

          {loadError && <p className={styles.error}>{loadError}</p>}
          {waiting.length === 0 && !loadError && (
            <p className={styles.empty}>Nobody is waiting for support.</p>
          )}

          <ul className={styles.list}>
            {waiting.map((request) => (
              <li
                key={request.conversationId}
                className={`${styles.item} ${
                  selected?.conversationId === request.conversationId ? styles.itemActive : ""
                }`}
              >
                <div>
                  <div className={styles.email}>{request.userEmail}</div>
                  <div className={styles.time}>
                    Waiting since {new Date(request.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <button type="button" className={styles.openButton} onClick={() => openChat(request)}>
                  Open chat
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.chat}>
          {!selected ? (
            <p className={styles.empty}>Open a chat from the list to start helping.</p>
          ) : chat.closed ? (
            <div className={styles.ended}>
              <p>The chat with {selected.userEmail} has ended.</p>
              <button type="button" className={styles.openButton} onClick={closeSelected}>
                Back to the queue
              </button>
            </div>
          ) : (
            <>
              <div className={styles.chatHeader}>
                <span>Chat with {selected.userEmail}</span>
                <button type="button" className={styles.closeButton} onClick={chat.close}>
                  Close chat
                </button>
              </div>
              {chat.error && <p className={styles.error}>{chat.error}</p>}
              <SupportConversation
                messages={chat.messages}
                myEmail={myEmail}
                canSend={!!chat.conversationId}
                onSend={chat.send}
                emptyText="The user is waiting — send a message to let them know you're here."
                placeholder="Reply to the user..."
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
