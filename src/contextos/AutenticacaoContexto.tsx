// AutenticacaoContexto.tsx

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { 
    onAuthStateChanged, 
    type User, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    updatePassword
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; // Importações do Firestore
import { auth, db } from "../servicos/firebase"; // Assumindo que 'db' é importado

// --- INTERFACES PARA TIPAGEM ---

// 1. Definição do Perfil de Gamificação do Firestore
export interface UsuarioData { // Exportei a interface para ser usada em outros lugares (como Home.tsx)
    nome: string;
    email: string;
    pontosTotais: number;           // Campo crucial para Ranking/Dashboard
    desafiosConcluidos: string[];   // CORREÇÃO AQUI: DEVE SER UM ARRAY DE STRING para usar .length
    tagsBaixaPontuacao: string[];   // Campo crucial para Desafios/Quiz
    dataCadastro: string;
}

// 2. Interface do Contexto (Mantida)
interface AutenticacaoContextoProps {
    usuarioLogado: User | null;
    usuarioData: UsuarioData | null; 
    carregando: boolean;
    carregandoDados: boolean;        
    login: (email: string, senha: string) => Promise<void>;
    cadastro: (email: string, senha: string, nome: string) => Promise<void>;
    logout: () => Promise<void>;
    atualizarNomeUsuario: (novoNome: string) => Promise<void>;
    atualizarSenhaUsuario: (novaSenha: string) => Promise<void>;
    recarregarUsuarioData: () => Promise<void>; 
}

const AutenticacaoContexto = createContext<AutenticacaoContextoProps>({
    usuarioLogado: null,
    usuarioData: null,
    carregando: true,
    carregandoDados: false,
    login: async () => {},
    cadastro: async () => {},
    logout: async () => {},
    atualizarNomeUsuario: async () => {},
    atualizarSenhaUsuario: async () => {},
    recarregarUsuarioData: async () => {}, 
});

// --- PROVEDOR DE CONTEXTO ---

export function AutenticacaoProvider({ children }: { children: ReactNode }) {
    const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null);
    const [usuarioData, setUsuarioData] = useState<UsuarioData | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [carregandoDados, setCarregandoDados] = useState(false);

    // Função auxiliar para buscar os dados do Firestore
    const fetchUsuarioData = async (user: User) => {
        if (!user) {
            setUsuarioData(null);
            return;
        }
        setCarregandoDados(true);
        try {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // TRATAMENTO DE DADOS (CORREÇÃO DE ARRAY): Garante que é um array, senão usa []
                const desafiosConcluidosArray = Array.isArray(data.desafiosConcluidos) 
                                                ? data.desafiosConcluidos 
                                                : [];
                
                // Mapeamento explícito para garantir a tipagem correta
                const perfilData: UsuarioData = {
                    nome: data.nome || user.displayName || "Usuário",
                    email: data.email || user.email || "",
                    pontosTotais: data.pontosTotais || 0,
                    desafiosConcluidos: desafiosConcluidosArray, // Usa o array tratado
                    tagsBaixaPontuacao: Array.isArray(data.tagsBaixaPontuacao) ? data.tagsBaixaPontuacao : [],
                    dataCadastro: data.dataCadastro || new Date().toISOString(),
                };

                setUsuarioData(perfilData);
            } else {
                // Cria um perfil básico (CORREÇÃO AQUI: desafiosConcluidos inicializado como [])
                console.warn("Documento de perfil não encontrado no Firestore. Criando um básico.");
                const novoPerfil: UsuarioData = {
                    nome: user.displayName || "Novo Usuário",
                    email: user.email || "",
                    pontosTotais: 0,
                    desafiosConcluidos: [], // CORREÇÃO: ARRAY VAZIO
                    tagsBaixaPontuacao: [],
                    dataCadastro: new Date().toISOString(),
                };
                await setDoc(docRef, novoPerfil);
                setUsuarioData(novoPerfil);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário no Firestore:", error);
            setUsuarioData(null);
        } finally {
            setCarregandoDados(false);
        }
    };
    
    // NOVO: Função para ser chamada após transações de pontos/quiz
    const recarregarUsuarioData = async () => {
        if (usuarioLogado) {
            await fetchUsuarioData(usuarioLogado);
        }
    };

    // Efeito Principal: Ouve mudanças de autenticação e busca dados do Firestore
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUsuarioLogado(user);
            if (user) {
                await fetchUsuarioData(user); // CHAMA A FUNÇÃO DE BUSCA DE DADOS
            } else {
                setUsuarioData(null);
            }
            setCarregando(false);
        });
        return () => unsubscribe();
    }, []); 

    // --- FUNÇÕES DE AUTENTICAÇÃO (Atualizadas para usar a nova tipagem) ---

    const login = async (email: string, senha: string) => {
        const userCred = await signInWithEmailAndPassword(auth, email, senha);
        await fetchUsuarioData(userCred.user); // BUSCA DADOS APÓS LOGIN
    };

    const cadastro = async (email: string, senha: string, nome: string) => {
        const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
        if (credenciais.user) {
            await updateProfile(credenciais.user, { displayName: nome });
            await fetchUsuarioData(credenciais.user);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUsuarioData(null); // Limpa os dados do perfil também
    };
    
    // Atualizar Nome - ATUALIZA NO AUTH E NO FIRESTORE
    const atualizarNomeUsuario = async (novoNome: string) => {
        if (!usuarioLogado || !usuarioData) throw new Error("Usuário não logado");
        
        await updateProfile(usuarioLogado, { displayName: novoNome });
        
        const docRef = doc(db, "usuarios", usuarioLogado.uid);
        await updateDoc(docRef, { nome: novoNome });

        // Atualiza o estado local do Contexto
        setUsuarioLogado({ ...usuarioLogado, displayName: novoNome });
        setUsuarioData({ ...usuarioData, nome: novoNome }); 
    };

    const atualizarSenhaUsuario = async (novaSenha: string) => {
        if (!usuarioLogado) throw new Error("Usuário não logado");
        await updatePassword(usuarioLogado, novaSenha);
    };

    // --- RENDERIZAÇÃO DO CONTEXTO ---

    return (
        <AutenticacaoContexto.Provider 
            value={{ 
                usuarioLogado, 
                usuarioData,           
                carregando, 
                carregandoDados,       
                login, 
                cadastro, 
                logout, 
                atualizarNomeUsuario, 
                atualizarSenhaUsuario,
                recarregarUsuarioData, 
            }}
        >
            {children}
        </AutenticacaoContexto.Provider>
    );
}

export function useAutenticacao() {
    const context = useContext(AutenticacaoContexto);
    if (context === undefined) {
        throw new Error('useAutenticacao must be used within an AutenticacaoProvider');
    }
    return context;
}