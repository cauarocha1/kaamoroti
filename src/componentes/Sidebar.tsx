import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAutenticacao } from "../contextos/AutenticacaoContexto";
import { signOut } from "firebase/auth";
import { auth } from "../servicos/firebase";
import { Home, Zap, Target, Info, User, Settings, LogOut, Trophy, HelpCircle } from 'lucide-react'; // Importei HelpCircle para maior clareza, mas Info também funciona!
import Logo1 from '../assets/logokaamorotibranca.svg';


export default function Sidebar() {
    const { usuarioLogado } = useAutenticacao();
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();

    const handleSair = async () => {
        await signOut(auth);
        navigate("/home");
        setMenuAberto(false);
    };

    const linksNavegacao = [
        { to: "/home", label: "Início", Icon: Home },
        { to: "/quiz", label: "Fazer Quiz", Icon: Zap },
        { to: "/desafios", label: "Desafios", Icon: Target },
        { to: "/ranking", label: "Ranking Global", Icon: Trophy }, 
        { to: "/perfil", label: "Meu Progresso", Icon: User },
        { to: "/sobre", label: "Sobre o Projeto", Icon: Info },
    ];

    return (
        <nav className="fixed top-0 left-0 h-screen w-64 bg-green-700 text-white p-4 shadow-2xl flex flex-col justify-between z-50">
            
            <div>
                <Link to="/home" className="flex items-center space-x-2 text-2xl font-bold tracking-wide mb-8 border-b border-green-600 pb-4">
                    <img 
                        src={Logo1} 
                        alt="Logo Ka'a Morotĩ" 
                        className="w-8 h-8"
                    />
                    <span>Ka'a Morotĩ</span>
                </Link>

                <div className="space-y-2">
                    {linksNavegacao.map(link => (
                        <Link 
                            key={link.to}
                            to={link.to} 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-600 transition duration-150 group" 
                            onClick={() => setMenuAberto(false)}
                        >
                            <link.Icon className="w-5 h-5 group-hover:text-green-200" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-green-600">
                {!usuarioLogado ? (
                    <div className="space-y-2">
                        <Link to="/login" className="w-full text-center block py-2 bg-green-600 rounded-lg hover:bg-green-500 transition">
                            Login
                        </Link>
                        <Link to="/cadastro" className="w-full text-center block py-2 border border-green-500 rounded-lg hover:bg-green-600 transition">
                            Cadastre-se
                        </Link>
                    </div>
                ) : (
                    <div className="relative">
                        <div 
                            className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-green-600 transition"
                            onClick={() => setMenuAberto(!menuAberto)}
                        >
                            <div className="w-10 h-10 rounded-full bg-white text-green-700 font-bold flex items-center justify-center ring-2 ring-green-400">
                                {usuarioLogado.displayName?.[0].toUpperCase() || "U"}
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-semibold truncate">{usuarioLogado.displayName || "Usuário"}</p>
                                <p className="text-xs text-green-200 truncate">{usuarioLogado.email}</p>
                            </div>
                        </div>

                        {menuAberto && (
                            <div className="absolute bottom-full mb-2 left-0 w-full bg-white text-green-700 rounded-lg shadow-2xl py-2 z-50 overflow-hidden">
                                
                                <Link to="/ajuda" className="flex items-center space-x-2 px-4 py-2 hover:bg-green-100 text-sm" onClick={() => setMenuAberto(false)}>
                                    <HelpCircle className="w-4 h-4" /> <span>Ajuda</span>
                                </Link>
                                
                                <Link to="/configuracoes" className="flex items-center space-x-2 px-4 py-2 hover:bg-green-100 text-sm" onClick={() => setMenuAberto(false)}>
                                    <Settings className="w-4 h-4" /> <span>Configurações</span>
                                </Link>
                                
                                <button onClick={handleSair} className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-red-100 text-sm text-red-600 border-t mt-1">
                                    <LogOut className="w-4 h-4" /> <span>Sair</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}