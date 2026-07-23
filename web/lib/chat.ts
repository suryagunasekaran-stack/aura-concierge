export type MessageRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
};

export function formatTime(date: Date): string {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  const minutePart = String(minutes).padStart(2, "0");
  return `${hours12}:${minutePart} ${period}`;
}

export function createMessage(
  role: MessageRole,
  text: string,
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    timestamp: new Date(),
  };
}
