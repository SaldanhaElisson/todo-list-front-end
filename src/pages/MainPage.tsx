import { Container, Paper, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export const MainPage: React.FC = () => {
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "white",
          minHeight: "500px",
          minWidth: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",

          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          justifyContent: "center",

          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },

          "@media (min-width: 600px)": {
            minWidth: "400px",
          },
          "@media (min-width: 960px)": {
            minWidth: "600px",
          },
        }}
      >
        <Container>
          <Typography
            variant="h1"
            sx={{
              paddingY: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",

              "@media (min-width: 600px)": {
                fontSize: "2rem",
              },
              "@media (min-width: 960px)": {
                fontSize: "2.5rem",
              },
            }}
          >
            Todo APP
          </Typography>
          <Outlet />
        </Container>
      </Paper>
    </>
  );
};
