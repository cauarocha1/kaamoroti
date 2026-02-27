import { AutenticacaoProvider } from "./contextos/AutenticacaoContexto";
import { Rotas } from "./rotas/Rotas";

export default function App() {
  return (
    <AutenticacaoProvider>
      <Rotas />
    </AutenticacaoProvider>
  );
}
