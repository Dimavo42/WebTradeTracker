// Same shape as SupportRequestDto in the .NET API (GET/POST /api/chatbot)
export interface SupportRequestDto {
  conversationId: string;
  userId: number;
  userEmail: string;
  createdAt: string;
}
