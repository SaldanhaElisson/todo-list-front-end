import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages";
import { MainPage } from "./pages/MainPage";
import { EditPage } from "./pages/EditPage";
import Erro from "./components/Erro";

const Routers: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}>
        <Route index element={<HomePage />} />
        <Route path="/todo/:id" element={<EditPage />} />
        <Route path="*" element={<Erro message="Error 404" />} />
        Erro
      </Route>
    </Routes>
  );
};

export default Routers;
