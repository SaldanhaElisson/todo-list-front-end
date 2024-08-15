import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErroProps {
  message: string;
  showBackButton?: boolean;
}

const Erro: React.FC<ErroProps> = ({ message, showBackButton = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "error.main",
          color: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 40, marginBottom: "1rem" }} />
        <Typography variant="h6" gutterBottom>
          Ocorreu um erro
        </Typography>
        <Typography variant="body1">{message}</Typography>
        {showBackButton && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: "1rem" }}
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Erro;
