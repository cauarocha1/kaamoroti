import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAutenticacao } from "../contextos/AutenticacaoContexto";

interface ProtecaoRotasProps {
  children: ReactNode;
}

export function ProtecaoRotas({ children }: ProtecaoRotasProps) {
  const { usuarioLogado, carregando } = useAutenticacao();

  if (carregando) return <p>Carregando...</p>;

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}