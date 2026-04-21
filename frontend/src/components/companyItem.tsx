import React from "react";
import { ICompanyResponse } from "../types/Company";
import defaultLogotype from '../assets/images/item_company_icon_default.png';

interface Props {
  company: ICompanyResponse;
}

export const CompanyItem: React.FC<Props> = ({ company }) => {
  const date = new Date(company.createdAt);
  const formattedDate = date.toISOString().split('T')[0];

  return (
    <div className="mx-auto min-w-[380px] h-20 bg-slate-800 p-5 companyGrid mb-4 
    shadow-sm rounded-md border border-slate-600">
      <div className="h-[40px] w-[40px] rounded-full shadow-lg p-1 mr-3">
          <img src={company.logotype || defaultLogotype} alt="avatar" className="p-1"/>
      </div>
      <p className="truncate font-poppins">{company.name}</p>
      <p className="truncate font-poppins">{company.service}</p>
      <p className="truncate font-poppins">{company.capital}</p>
      <p className="truncate font-poppins">{formattedDate}</p>
    </div>
  )
}