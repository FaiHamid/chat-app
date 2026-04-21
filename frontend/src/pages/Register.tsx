import { Button, TextField } from "@mui/material";
import { authService } from "../services/authService";
import { useMutation } from "@tanstack/react-query";
import { IUser } from "../types/User";
import { useNavigate } from "react-router-dom";
import { CustomLoader } from "../components/customLoader";
import { PasswordField } from "../components/passwordField";

import { useForm } from "react-hook-form";
import { emailPattern } from "../utils/emailPattern";

export const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IUser>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation<void, Error, IUser>({
    mutationFn: async (newUser) => {
      await authService.register(newUser);
      return;
    },
    onSuccess: () => {
      navigate("/check-email");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const handleRegisterUser = async (data: IUser) => {
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegisterUser)}
      className="max-w-[600px] bg-slate-800 mx-auto flex flex-col py-7 px-16 rounded-lg mt-5 border border-slate-600"
    >
      {mutation.isPending ? (
        <CustomLoader loaderSize={110} paddingY={162} />
      ) : (
        <>
          <h1 className="text-[24px] mb-5">Register:</h1>
          <TextField
            required
            error={!!errors.name}
            helperText={errors.name && errors.name.message}
            id="outlined-basic"
            label="Name"
            variant="outlined"
            {...register("name", {
              required: "Name is required",
            })}
            sx={{ mb: "12px", width: "100%" }}
          />
          <TextField
            required
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            {...register("email", {
              required: "Email is required",
              pattern: emailPattern,
            })}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            autoComplete="email"
            sx={{ mb: "12px", width: "100%" }}
          />
          <PasswordField
            errorValue={errors.password}
            label="Password"
            registerProps={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <PasswordField
            errorValue={errors.confirmPassword}
            label="Confirm Password"
            registerProps={register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => {
                const password = watch("password");
                return value === password || `Passwords must match: ${password}`;
              }
            })}
          />
          <div>
            <Button variant="contained" type="submit">
              Sign up
            </Button>
          </div>
        </>
      )}
    </form>
  );
};
