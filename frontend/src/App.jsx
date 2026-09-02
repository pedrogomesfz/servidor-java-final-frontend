import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Registo from "./pages/Registo";
import CriarServicos from "./pages/CriarServicos";
import ProtectedRoute from "./componentes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/criarservicos" element={<CriarServicos />} />
        
        
        {/* Rotas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/criarservicos" 
          element={
            <ProtectedRoute>
              <CriarServicos />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;