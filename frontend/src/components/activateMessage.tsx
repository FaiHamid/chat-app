import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomLoader } from "./customLoader";
import { UserWithoutToken } from "../types/User";
import { authService } from "../services/authService";
import { accessTokenService } from "../services/accessTokenService";

export const ActivateMessage = () => {
  const { activatedToken } = useParams<{ activatedToken: string }>();
  const navigate = useNavigate();

  const getResponse = async (): Promise<UserWithoutToken> => {
    if (!activatedToken) {
      throw new Error("No activation token provided");
    }

    const { accessToken, ...user } = await authService.activate(activatedToken);
    accessTokenService.save(accessToken);

    return user;
  };

  const { error, isLoading, isSuccess } = useQuery<UserWithoutToken, Error>({
    queryKey: ["activateUser", activatedToken],
    queryFn: getResponse,
    enabled: !!activatedToken
  });

  useEffect(() => {
    if (error) {
      navigate("/login", { replace: true });
      return;
    }

    if (isSuccess) {
      navigate("/companies", { replace: true });
    }
  }, [error, isSuccess, navigate]);

  if (isLoading) {
    return <CustomLoader loaderSize={140} paddingY={150} />;
  }

  return null;
};
