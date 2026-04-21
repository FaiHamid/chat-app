import React from "react";
import { CircularProgress } from "@mui/material";

interface Props {
  loaderSize: number;
  paddingY: number;
}

export const CustomLoader: React.FC<Props> = ({ loaderSize, paddingY }) => (
  <div className="mx-auto" style={{ width: loaderSize }}>
    <CircularProgress size={`${loaderSize}px`} sx={{ mx: "auto", my:`${paddingY}px`}}/>
  </div>
  
)