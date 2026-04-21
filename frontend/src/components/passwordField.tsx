import { Visibility, VisibilityOff } from "@mui/icons-material"
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material"
import React, { useState } from "react"
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  errorValue: { message?: string} | undefined;
  label: string;
  registerProps: UseFormRegisterReturn<string>;
}

export const PasswordField: React.FC<Props> = ({ errorValue, label, registerProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl
    sx={{ mb: "12px", width: "100%" }}
    variant="outlined"
    error={!!errorValue}
  >
    <InputLabel htmlFor="outlined-adornment-password">
      {label}
    </InputLabel>
    <OutlinedInput
      id="outlined-adornment-password"
      type={showPassword ? "text" : "password"}
      {...registerProps}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      label={label}
    />
    {errorValue && (
      <FormHelperText>{errorValue.message}</FormHelperText>
    )}
  </FormControl>
  )
}