import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const Load: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
      }}
      data-testid="box-container"
    >
      <CircularProgress />
    </Box>
  );
};
