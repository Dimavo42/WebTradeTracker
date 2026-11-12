import { ENV } from "../common/env";
import type { Message } from "../types/chatbot";

const BASE_URL = `${ENV.BASE_URL}/chatbot`;


export async function sendMessage(message:string): Promise<Message> {
    const response = await fetch(`${BASE_URL}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message }),
        signal:AbortSignal.timeout(120_000),
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.error || "Failed to send message");
    }
    return data;
}