import React from "react";
import { useMutation } from "@tanstack/react-query";
import { EVariantLogout } from "../types/User";
import { Button, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { accessTokenService } from "../services/accessTokenService";
import { authService } from "../services/authService";

interface Props {
  variant: EVariantLogout;
  handleClick: () => void;
}

export const LogoutComponent: React.FC<Props> = ({ variant, handleClick }) => {
  const navigate = useNavigate();

  const mutation = useMutation<void, Error>({
    mutationFn: async () => {
      await authService.logout();

      return;
    },
    onSuccess: () => {
      accessTokenService.remove();
      navigate('/login');
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const onClick = async () => {
    try {
      await mutation.mutateAsync();
      handleClick();
      console.log('hi logout')
    } catch {
      throw new Error("Something went wrong");
    }
  };

  return variant === "menu" ? (
    <MenuItem onClick={onClick} style={{ paddingInline: "35px" }}>
      Logout
    </MenuItem>
  ) : (
    <Button variant="contained" color="error" onClick={onClick}>
      Logout
    </Button>
  );
};
