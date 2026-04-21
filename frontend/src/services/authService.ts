import { IUser, IUserLogin, IUserRespons } from "../types/User";
import { useHttp } from "../api/http";

const register = async (newUser: IUser): Promise<IUserRespons> => {
  return await useHttp.post<IUser, IUserRespons>('/register', newUser)
}

const activate = async (activationToken: string): Promise<IUserRespons> => {

  try {
    const resp = await useHttp.get<string, IUserRespons>(`activate/${activationToken}`, { withCredentials: true });
    console.log('response from server', resp);
    return resp;
  } catch (error) {
    console.error('Error during the request:', error);
    throw error;
  }
}

const login = async ({ email, password }: IUserLogin): Promise<IUserRespons> => {
  const resp = await useHttp.post<IUserLogin, IUserRespons>('/login', { email, password }, {withCredentials: true});

  return resp;
}

const logout = async () => {
  await useHttp.post('/logout', {}, {withCredentials: true});
}

const refresh = async (): Promise<{ accessToken: string}> => {
  return await useHttp.get('/refresh', {withCredentials: true});
}


export const authService = { register, login, activate, logout, refresh };