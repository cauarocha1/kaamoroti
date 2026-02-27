import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../servicos/firebase";
import Layout from "../componentes/Layout";
import { useAutenticacao } from "../contextos/AutenticacaoContexto";
import Logo from '../assets/logokaamorotipreta.svg'; 
import { Mail, Lock, LogIn as LogInIcon, Loader2 } from 'lucide-react'; 

export default function Login() {
    const navigate = useNavigate();
    const { usuarioLogado } = useAutenticacao(); 
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (usuarioLogado) {
            navigate("/home"); 
        }
    }, [usuarioLogado, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(""); 
        setLoading(true); 

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            
                navigate("/home"); 
            
        } catch (error: any) {
            console.error("Erro no login:", error); 
            
            setErro("E-mail ou senha incorretos. Verifique suas credenciais.");
        } finally {
            
            if (!usuarioLogado) {
                 setLoading(false); 
            }
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
                        Acessar Conta
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    
                    
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

                    {erro && <p className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium mt-3 text-center">{erro}</p>}

                    <button
                        type="submit"
                        disabled={loading} 
                        className="w-full flex justify-center items-center py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2"/> Acessando...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <LogInIcon className="w-5 h-5 mr-2"/> Entrar
                            </span>
                        )}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Não tem conta?{" "}
                    <Link to="/cadastro" className="text-green-700 font-bold hover:text-green-800 transition">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </Layout>
    );
}