import React, { useState } from "react";
import { CustomLoader } from "../components/customLoader";
import { PasswordField } from "../components/passwordField";
import { ESnackbarStatus, IPasswordData, IUserToChange } from "../types/User";
import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AutohideSnackbar } from "../utils/snackBar";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { accessTokenService } from "../services/accessTokenService";
import { userService } from "../services/userService";
import { currentUserQuery } from "../reactQuery/userQuery";
import { queryKeys } from "../reactQuery/queriesKey";
import { useForm } from "react-hook-form";

export const ResetPassword: React.FC = () => {
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);
  const queryClient = useQueryClient();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarDetails, setSnackbarDetails] = useState({
    message: "",
    status: ESnackbarStatus.Success,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IPasswordData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation<void, Error, Partial<IUserToChange>>({
    mutationFn: async (data: Partial<IUserToChange>) => {
      await userService.updateUser(currentUser!.id, data);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getCurrentUser] });
    },
    onError: () => {},
  });

  const mutationLogout = useMutation<void, Error>({
    mutationFn: async () => {
      await authService.logout();

      return;
    },
    onSuccess: () => {
      accessTokenService.remove();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const handleReset = async (data: IPasswordData) => {

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await mutation.mutateAsync({
        hashPassword: data.newPassword,
        password: data.oldPassword,
      });
      setSnackbarDetails({
        message: "Success reset password",
        status: ESnackbarStatus.Success,
      });
      setSnackbarOpen(true);
      reset();
      await mutationLogout.mutateAsync();
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        setSnackbarDetails({
          message: errorMessage,
          status: ESnackbarStatus.Error,
        });
        setSnackbarOpen(true);
      } else {
        console.error("Failed to reset password:", error);
      }
    }
  };

  if (isLoading) {
    <CustomLoader loaderSize={30} paddingY={50} />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleReset)}
      className="max-w-[600px] bg-slate-800 mx-auto flex flex-col py-7 px-16 rounded-lg mt-5 border border-slate-600"
    >
      {mutation.isPending ? (
        <CustomLoader loaderSize={110} paddingY={61} />
      ) : (
        <>
          <h1 className="text-[24px] mb-5">Reset password:</h1>
          <PasswordField
            errorValue={errors.oldPassword}
            label="Old password"
            registerProps={register("oldPassword", {
              required: "Old password is required",
              minLength: { value: 6, message: "Old password must be at least 6 characters" },
            })}
          />
          <PasswordField
            errorValue={errors.newPassword}
            label="New password"
            registerProps={register("newPassword", {
              required: "newPassword is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          <PasswordField
            errorValue={errors.confirmPassword}
            label="ConfirmPassword password"
            registerProps={register("confirmPassword", {
              required: "confirmPassword is required",
              validate: (value) => {
                const password = watch("newPassword");
                return value === password || `Passwords must match: ${password}`;
              }
            })}
          />
          <div className="flex justify-between mt-5">
            <Button variant="contained" type="submit">
              Reset
            </Button>
          </div>
        </>
      )}
      <AutohideSnackbar
        message={snackbarDetails.message}
        isOpen={snackbarOpen}
        onClose={setSnackbarOpen}
        status={snackbarDetails.status}
      />
    </form>
  );
};
