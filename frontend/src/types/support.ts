// A user waiting in the support queue (GET/POST /api/chatbot)
export type SupportRequest = {
  conversationId: string;
  userId: number;
  userEmail: string;
  createdAt: string;
};

// A live chat message relayed by the BFF socket
export type SupportMessage = {
  conversationId: string;
  text: string;
  from: string; // sender's email
  sentAt: string;
};
