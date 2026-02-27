import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { ProtecaoRotas } from "./ProtecaoRotas"; // Seu componente de proteção

// 1. DEFINIÇÕES DE CARREGAMENTO DINÂMICO (Code Splitting)

// Rotas Públicas
const Login = lazy(() => import("../paginas/Login"));
const Cadastro = lazy(() => import("../paginas/Cadastro"));
const Home = lazy(() => import("../paginas/Home")); 
const Contato = lazy(() => import("../paginas/Contato")); // MOVIDO PARA PÚBLICO

// Rotas Privadas
const Sobre = lazy(() => import("../paginas/Sobre"));
const Desafios = lazy(() => import("../paginas/Desafios"));
const Perfil = lazy(() => import("../paginas/Perfil"));
const Configuracoes = lazy(() => import("../paginas/Configuracoes"));
const Ajuda = lazy(() => import("../paginas/Ajuda"));
const Quiz = lazy(() => import("../paginas/Quiz"));
const Ranking = lazy(() => import("../paginas/Ranking"));


export function Rotas() {
    return (
        <BrowserRouter>
            <Suspense
				fallback={
					<div className="flex items-center justify-center min-h-screen text-xl text-green-700 font-semibold">
						Carregando Ka'a Morotĩ...
					</div>
				}
            >
                <Routes>
                    {/* ROTAS PÚBLICAS */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/contato" element={<Contato />} /> {/* ROTA DE CONTATO AGORA É PÚBLICA */}

                    {/* Rotas privadas - Protegidas por ProtecaoRotas */}
                    <Route
                        path="/sobre"
                        element={
                            <ProtecaoRotas>
                                <Sobre />
                            </ProtecaoRotas>
                        }
                    />
                    <Route
                        path="/desafios"
                        element={
                            <ProtecaoRotas>
                                <Desafios />
                            </ProtecaoRotas>
                        }
                    />
                    <Route
                        path="/perfil"
                        element={
                            <ProtecaoRotas>
                                <Perfil />
                            </ProtecaoRotas>
                        }
                    />
                    <Route
                        path="/configuracoes"
                        element={
                            <ProtecaoRotas>
                                <Configuracoes />
                            </ProtecaoRotas>
                        }
                    />
                    <Route
                        path="/ajuda"
                        element={
                            <ProtecaoRotas>
                                <Ajuda />
                            </ProtecaoRotas>
                        }
                    />
                    <Route
                        path="/quiz"
                        element={
                            <ProtecaoRotas>
                                <Quiz />
                            </ProtecaoRotas>
                        }
                    />
                    <Route
                        path="/ranking"
                        element={
                            <ProtecaoRotas>
                                <Ranking />
                            </ProtecaoRotas>
                        }
                    />
                    {/* A ROTA /contato FOI REMOVIDA DAQUI */}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}