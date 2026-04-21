import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { IUserLogin, IUserRespons } from "../types/User";
import { CustomLoader } from "../components/customLoader";
import { PasswordField } from "../components/passwordField";
import { authService } from "../services/authService";
import { accessTokenService } from "../services/accessTokenService";
import { useForm } from "react-hook-form";
import { emailPattern } from "../utils/emailPattern";

export const Login = () => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<IUserLogin>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: {
        email: "",
        password: "",
      },
    });
  
  const navigate = useNavigate();

  const mutation = useMutation<IUserRespons, Error, IUserLogin>({
    mutationFn: async (currentUser) => (await authService.login(currentUser)),
    onSuccess: (data) => {
      const { accessToken } = data;
      accessTokenService.save(accessToken);
      navigate("/chats", { replace: true });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });


  const handleLogin = async (data: IUserLogin) => {

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await mutation.mutateAsync(data);
      reset();
      // navigate('/companies');
    } catch (error) {
      console.error("Failed to login user:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="max-w-[600px] bg-slate-800 mx-auto flex flex-col py-7 px-16 rounded-lg mt-5 border border-slate-600"
    >
      {mutation.isPending ? (
        <CustomLoader loaderSize={110} paddingY={61} />
      ) : (
        <>
          <h1 className="text-[24px] mb-5">Login:</h1>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
            {...register("email",{
              required: "Email is required",
              pattern: emailPattern,
            })}
            sx={{ mb: "12px", width: "100%" }}
          />
          <PasswordField
            errorValue={errors.password}
            label="Password"
            registerProps={register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          <div className="flex justify-between mt-5">
            <Button variant="contained" type="submit">
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
        </>
      )}
    </form>
  );
};
