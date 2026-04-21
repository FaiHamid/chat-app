import { IUserRespons, IUserToChange } from "../types/User";
import { useHttp } from "../api/http";

export const getUser = async (): Promise<IUserRespons> => {
  return await useHttp.get<string, IUserRespons>(`/users/current`)
}

export const updateUser = async (userId: string, data: Partial<IUserToChange>): Promise<IUserRespons> => {
  return await useHttp.put(`/users/${userId}`, data);
}

export const userService = { getUser, updateUser };