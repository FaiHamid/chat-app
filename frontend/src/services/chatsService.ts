import { useHttp } from "../api/http";

export interface IChatResponse {
  id: number;
  title: string;
  inviteLink?: string;
  updatedAt?: string;
}

interface IRoomResponse {
  id: number;
  name: string;
  inviteCode?: string;
  updatedAt?: string;
}

interface ICreateRoomPayload {
  name: string;
}

interface ICreateChatResponse {
  inviteCode: string;
}

export const getAllChats = async (): Promise<IChatResponse[]> => {
  const rooms = await useHttp.get<void, IRoomResponse[]>("/rooms");

  return rooms.map((room) => ({
    id: room.id,
    title: room.name,
    inviteLink: room.inviteCode,
    updatedAt: room.updatedAt,
  }));
};

export const createChat = async (title: string): Promise<ICreateChatResponse> => {
  const inviteCode = await useHttp.post<ICreateRoomPayload, string>("/rooms", {
    name: title,
  });

  return { inviteCode };
};

export const joinChat = async (inviteCode: string): Promise<void> => {
  await useHttp.post<void, void>(`/rooms/join/${inviteCode}`);
};

export const chatsService = { getAllChats, createChat, joinChat };
