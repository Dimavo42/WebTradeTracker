import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { ENV } from "../common/env";
import type { SupportMessage } from "../types/support";

// The socket lives on the BFF server itself (not under /api), so take the origin of BASE_URL.
// Works for an absolute URL (http://localhost:3001/api) and a relative one (/api).
const SOCKET_URL = `${new URL(ENV.BASE_URL, window.location.href).origin}/chatbot/support`;

type Options = {
  token: string | null;
  enabled: boolean;
  onQueueChanged?: () => void;
};

// Live support conversation over the BFF socket. Used by the user (chatbot) and the admin page.
export function useSupportChat({ token, enabled, onQueueChanged }: Options) {
  const socketRef = useRef<Socket | null>(null);
  const conversationRef = useRef<string | null>(null);
  // Latest callback without reconnecting the socket when it changes
  const onQueueChangedRef = useRef(onQueueChanged);
  useEffect(() => {
    onQueueChangedRef.current = onQueueChanged;
  }, [onQueueChanged]);

  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [closed, setClosed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !token) return;

    const socket = io(SOCKET_URL, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      // After a reconnect the server forgot our room — join it again
      if (conversationRef.current) {
        socket.emit("support:join", { conversationId: conversationRef.current });
      }
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setError("Can't reach the support server."));

    socket.on("support:joined", ({ conversationId }: { conversationId: string }) => {
      setConversationId(conversationId);
      setError(null);
    });
    socket.on("support:message", (message: SupportMessage) => {
      if (message.conversationId === conversationRef.current) {
        setMessages((prev) => [...prev, message]);
      }
    });
    socket.on("support:closed", ({ conversationId }: { conversationId: string }) => {
      if (conversationId === conversationRef.current) {
        setClosed(true);
        conversationRef.current = null;
        setConversationId(null);
      }
    });
    socket.on("support:queue-changed", () => onQueueChangedRef.current?.());
    // Errors thrown by the gateway (WsException) arrive as "exception"
    socket.on("exception", (err: { message?: string }) =>
      setError(err?.message ?? "Support error"),
    );

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [enabled, token]);

  // Start listening to a conversation (clears the previous one)
  const join = useCallback((id: string) => {
    conversationRef.current = id;
    setConversationId(null);
    setMessages([]);
    setClosed(false);
    setError(null);
    socketRef.current?.emit("support:join", { conversationId: id });
  }, []);

  const send = useCallback((text: string) => {
    const id = conversationRef.current;
    if (!id || !text.trim()) return;
    socketRef.current?.emit("support:message", { conversationId: id, text });
  }, []);

  // Closes for everyone (removes it from the queue)
  const close = useCallback(() => {
    const id = conversationRef.current;
    if (!id) return;
    socketRef.current?.emit("support:close", { conversationId: id });
  }, []);

  // Forget the ended conversation so a new one can start
  const reset = useCallback(() => {
    conversationRef.current = null;
    setConversationId(null);
    setMessages([]);
    setClosed(false);
    setError(null);
  }, []);

  return { connected, conversationId, messages, closed, error, join, send, close, reset };
}
