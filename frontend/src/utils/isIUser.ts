import { ICompanyResponse } from "../types/Company";
import { UserWithoutToken } from "../types/User";

export function isUser(object: UserWithoutToken | ICompanyResponse): object is UserWithoutToken {
  return (object as UserWithoutToken).avatar !== undefined;
}