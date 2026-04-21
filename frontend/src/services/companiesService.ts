import { useHttp } from "../api/http";
import { ICompany, ICompanyResponse } from "../types/Company";

export const addNewCompany = async (companyData: Omit<ICompany, 'id'>): Promise<ICompanyResponse> => {
  const resp = await useHttp.post<ICompany, ICompanyResponse>('/companies', companyData);

  return resp;
}

export const getCompanies = async (): Promise<ICompanyResponse[]> => {
  const resp = await useHttp.get<void, ICompanyResponse[]>('/companies');

  return resp;
}

export const companiesService = { addNewCompany, getCompanies };