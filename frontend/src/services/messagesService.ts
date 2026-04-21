import { useHttp } from "../api/http";

export interface IMessageResponse {
  id: number;
  text: string;
  userId: string;
  roomId?: number;
  user?: {
    id: string;
    name: string;
  };
}

interface ICreateMessagePayload {
  text: string;
}

export const getAllMessages = async (
  chatId: number | string,
): Promise<IMessageResponse[]> => {
  return await useHttp.get<void, IMessageResponse[]>(`/messages/${chatId}`);
};

export const createMessage = async (
  chatId: number | string,
  text: string,
): Promise<void> => {
  await useHttp.post<ICreateMessagePayload, void>(`/messages/${chatId}`, {
    text,
  });
};

export const messagesService = { getAllMessages, createMessage };
