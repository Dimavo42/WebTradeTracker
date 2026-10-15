import { useCallback, useState } from "react";
import { sendMessage } from "../api/chatbotApi";


type ChatbotMessage = {
  sender: "user" | "bot";
  text: string;
};


export function useChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const load = useCallback(async (message: string) => {
        try {
            setLoading(true);
            const response = await sendMessage(message);
            setMessages(prev => [...prev, { sender: "bot", text: response }]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleChatbot = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const sendUserMessage = useCallback((message: string) => {
        const text = message.trim();
        if (!text) return;
        setMessages(prev => [...prev, { sender: "user", text: message }]);
        void load(message);
    }, [load]);

    return { isOpen, loading, messages, error, sendUserMessage, toggleChatbot, clearMessages };
}

