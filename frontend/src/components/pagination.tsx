import React from "react";
import { Pagination } from "@mui/material";

interface Props {
  page: number;
  amountOfPages: number;
  onChangePage: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export const PaginationComponent: React.FC<Props> = ({
  page,
  amountOfPages,
  onChangePage,
}) => {
  return (
    <Pagination
      count={amountOfPages}
      variant="outlined"
      color="primary"
      page={page}
      onChange={onChangePage}
      sx={{
        position: "absolute",
        bottom: "30px",
        left: "0",
        right: "0",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
};
