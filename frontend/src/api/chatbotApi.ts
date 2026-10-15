import { ENV } from "../common/env";

const BASE_URL = `${ENV.BASE_URL}/chatbot`;


export async function sendMessage(message:string): Promise<string> {
    const response = await fetch(`${BASE_URL}/message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.error || "Failed to send message");
    }
    return data.response;
}