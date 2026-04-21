import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { ESnackbarStatus } from "../types/User";

interface Props {
  message: string;
  isOpen: boolean;
  status: ESnackbarStatus;
  onClose: (value: boolean) => void;
}

export const AutohideSnackbar: React.FC<Props> = ({
  message,
  isOpen,
  status,
  onClose,
}) => {
  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    onClose(false);
  };

  return (
    <div>
      <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={status}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
