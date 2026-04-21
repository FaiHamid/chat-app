import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Navigate } from "react-router-dom";
import { currentUserQuery } from "../reactQuery/userQuery";
import { CustomLoader } from "../components/customLoader";

export const RedirectFromHome: React.FC = () => {
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);

  if (isLoading) {
    <CustomLoader loaderSize={30} paddingY={50} />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  } else {
    return <Navigate to="/chats" replace />;
  }
};
