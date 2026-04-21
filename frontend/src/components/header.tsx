import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DropdownMenu } from "./dropDownMenu";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { currentUserQuery } from "../reactQuery/userQuery";
import { CustomLoader } from "./customLoader";

export const Header: React.FunctionComponent = () => {
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);
  const navigate = useNavigate();

  if (isLoading) {
    <CustomLoader loaderSize={30} paddingY={50} />;
  }

  const chatLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition hover:text-[#8BC83F] ${
      isActive ? "text-[#8BC83F]" : "text-slate-300"
    }`;

  return (
    <header className="h-22 w-full bg-slate-800 border-b border-slate-700 shadow-lg p-5 px-10 flex justify-between mb-5 items-center">
      {currentUser ? (
        <nav className="flex items-center" aria-label="Main">
          <NavLink to="/chats" className={chatLinkClass}>
            Chats
          </NavLink>
        </nav>
      ) : (
        <div />
      )}

      {currentUser ? (
        <DropdownMenu />
      ) : (
        <div className="flex space-x-4">
          <Button variant="contained" onClick={() => navigate("/login")}>
            Sign in
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </div>
      )}
    </header>
  );
};
