import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../servicos/firebase";
import { doc, setDoc } from "firebase/firestore";
import Layout from "../componentes/Layout";
import { useAutenticacao } from "../contextos/AutenticacaoContexto";
import Logo from '../assets/logokaamorotipreta.svg';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function Cadastro() {
    const navigate = useNavigate();
    const { usuarioLogado } = useAutenticacao();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirm, setConfirm] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuarioLogado) {
            navigate("/home");
        }
    }, [usuarioLogado, navigate]);

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        if (senha !== confirm) {
            setErro("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            const usuarioCred = await createUserWithEmailAndPassword(auth, email, senha);

            if (usuarioCred.user) {
                await updateProfile(usuarioCred.user, { displayName: nome });

                await setDoc(doc(db, "usuarios", usuarioCred.user.uid), {
                    nome: nome,
                    email: email,
                    pontosTotais: 0, 
                    desafiosConcluidos: [], 
                    tagsBaixaPontuacao: [], 
                    dataCadastro: new Date().toISOString(),
                });

                navigate("/home"); 
            }
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            switch (error.code) {
                case "auth/email-already-in-use":
                    setErro("Já existe uma conta com este e-mail.");
                    break;
                case "auth/invalid-email":
                    setErro("E-mail inválido.");
                    break;
                case "auth/weak-password":
                    setErro("Senha muito fraca, use pelo menos 6 caracteres.");
                    break;
                default:
                    setErro("Ocorreu um erro. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideNav> 
            <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                
                
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="mb-3">
                        <img 
                            src={Logo} 
                            alt="Logo Ka'a Morotĩ" 
                            className="mx-auto h-24 w-auto" 
                        />
                    </Link>
                    <Link to="/">
                        <h1 className="text-4xl font-extrabold text-green-700 tracking-wide">
                            Ka'a Morotĩ
                        </h1>
                    </Link>
                    <p className="text-xl font-semibold mt-4 text-gray-700">
                        Crie sua Conta
                    </p>
                </div>

                <form onSubmit={handleCadastro} className="space-y-5">
                    
                    
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Nome</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                                required
                                disabled={loading}
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    
                    
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">E-mail</label>
                         <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                                required
                                disabled={loading}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    
                    
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Senha</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                                required
                                disabled={loading}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    
                    
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Confirmar Senha</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                                required
                                disabled={loading}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {erro && <p className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium mt-3 text-center">{erro}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2"/> Cadastrando...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <UserPlus className="w-5 h-5 mr-2"/> Cadastrar
                            </span>
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Já possui conta?{" "}
                    <Link to="/login" className="text-green-700 font-bold hover:text-green-800 transition">
                        Fazer login
                    </Link>
                </p>
            </div>
        </Layout>
    );
}