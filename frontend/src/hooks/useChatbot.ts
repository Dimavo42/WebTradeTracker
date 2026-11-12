import { useCallback, useState } from "react";
import { sendMessage } from "../api/chatbotApi";


type ChatbotMessage = {
  sender: "user" | "bot" | "admin";
  text: string;
};

export type ChatbotMode = "ai" | "admin";


export function useChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<ChatbotMode>("ai");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatbotMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    
    const load = useCallback(async (message: string) => {
        try {
            setLoading(true);
            const response = await sendMessage(message);
            console.log(response);
            setMessages(prev => [...prev, { sender: "bot", text: response.message }]);
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

 

    return { isOpen, mode, setMode, loading, messages, error, sendUserMessage, toggleChatbot, clearMessages };
}

