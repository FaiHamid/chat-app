import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { LogoutComponent } from "../components/logoutComponent";
import { ESnackbarStatus, EVariantLogout, IUserToChange } from "../types/User";
import { firebaseService } from "../services/firebaseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AutohideSnackbar } from "../utils/snackBar";
import { AxiosError } from "axios";
import { UploadAvatarOrLogo } from "../components/uploadAvatarOrLogo";
import { ETargetObject } from "../types/Company";
import { currentUserQuery } from "../reactQuery/userQuery";
import { CustomLoader } from "../components/customLoader";
import { userService } from "../services/userService";
import { queryKeys } from "../reactQuery/queriesKey";
import { useForm } from "react-hook-form";

export const Profile: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);
  const queryClient = useQueryClient();
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserToChange>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: currentUser?.name || "",
    },
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarDetails, setSnackbarDetails] = useState({
    message: "",
    status: ESnackbarStatus.Success,
  });
  const navigate = useNavigate();

  const mutation = useMutation<void, Error>({
    mutationFn: async () => {
      if (selectedFile) {
        const newUrl = await firebaseService.handleSave(selectedFile);
        setPreviewURL(newUrl || null);
      }
      return;
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error("Save to firebase failed:", error);
    },
  });

  const mutationUser = useMutation<void, Error, Partial<IUserToChange>>({
    mutationFn: async (data: Partial<IUserToChange>) => {
      await userService.updateUser(currentUser!.id, data);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getCurrentUser] });
    },
    onError: (error) => {
      console.error("Save to db failed:", error);
    },
  });

  const handleSaveData = async (data: IUserToChange) => {
    if (
      currentUser?.name === data.name &&
      !previewURL
    ) {
      console.log("nothing change");
      return;
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    const dataToReq: Partial<IUserToChange> = {};

    if (selectedFile) {
      try {
        await mutation.mutateAsync();
        setSnackbarDetails({
          message: "Success change information",
          status: ESnackbarStatus.Success,
        });
        setSnackbarOpen(true);
        dataToReq.avatar = previewURL || "";
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.message) {
          const errorMessage = error.response.data.message;
          setSnackbarDetails({
            message: errorMessage,
            status: ESnackbarStatus.Error,
          });
          setSnackbarOpen(true);
        }
        console.error("Failed to save user avatar:", error);
      }
    }

    if (currentUser?.name !== data.name) {
      dataToReq.name = data.name;
    }

    console.log("dataToReq", dataToReq);
    try {
      await mutationUser.mutateAsync(dataToReq);
      setPreviewURL("");
      setSelectedFile(null);
      setSnackbarDetails({
        message: "Success change information",
        status: ESnackbarStatus.Success,
      });
      setSnackbarOpen(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        setSnackbarDetails({
          message: errorMessage,
          status: ESnackbarStatus.Error,
        });
        setSnackbarOpen(true);
      }
      console.error("Failed to save user:", error);
    }
  };

  if (isLoading) {
    return <CustomLoader loaderSize={50} paddingY={70} />;
  }

  return (
    <div className="rounded-md bg-slate-800 p-10 border shadow-md border-slate-600">
      {mutation.isPending || mutationUser.isPending ? (
        <CustomLoader loaderSize={100} paddingY={250} />
      ) : (
        <>
          <div className="flex items-center mb-10 relative">
            <UploadAvatarOrLogo
              previewURL={previewURL}
              targetType={ETargetObject.User}
              selectedFile={selectedFile}
              onChangePreviewURL={setPreviewURL}
              onChangeSelectedFile={setSelectedFile}
            />

            <div className="ml-5">
              <p className="text-[24px] font-semibold mb-3">{currentUser?.name}</p>
              <p className="text-semi-gray mb-2">{currentUser?.email}</p>
              <p className=" ">Role: User</p>
            </div>
          </div>
          <p className="text-[28px] font-semibold mb-5">Personal Data:</p>
          <form onSubmit={handleSubmit(handleSaveData)}>
            <div className="max-w-[400px]">
              <p className="mb-3 font-semibold">Name:</p>
              <TextField
                required
                id="outlined-basic"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name && errors.name.message}
                {...register("name", {
                  required: "Name is required",
                })}
                sx={{ mb: "25px", width: "100%" }}
              />
            </div>

            <div className="flex flex-col max-w-[200px]">
              <Button variant="contained" sx={{ mb: "50px" }} type="submit">
                Save
              </Button>
              <Button
                variant="contained"
                color="warning"
                sx={{ mb: "20px" }}
                onClick={() => navigate("/reset-password")}
              >
                Reset password
              </Button>
              <LogoutComponent
                variant={EVariantLogout.Button}
                handleClick={() => {}}
              />
            </div>
          </form>
        </>
      )}

      <AutohideSnackbar
        message={snackbarDetails.message}
        isOpen={snackbarOpen}
        onClose={setSnackbarOpen}
        status={snackbarDetails.status}
      />
    </div>
  );
};
