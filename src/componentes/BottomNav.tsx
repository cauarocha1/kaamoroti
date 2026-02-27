import { Link, useLocation } from "react-router-dom";
import { Home, Zap, Target, User, Trophy } from 'lucide-react'; 

const linksMobile = [
    { to: "/home", label: "Início", Icon: Home, highlight: false },
    { to: "/ranking", label: "Ranking", Icon: Trophy, highlight: false }, 
    { to: "/quiz", label: "Quiz", Icon: Zap, highlight: true }, 
    { to: "/desafios", label: "Ações", Icon: Target, highlight: false }, 
    { to: "/perfil", label: "Eu", Icon: User, highlight: false }, 
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bg-white shadow-2xl border-t-2 border-green-100 h-16 fixed bottom-0 left-0 right-0 z-40">
            <div className="max-w-xl mx-auto h-full flex justify-around items-center px-2">
                
                {linksMobile.map((link) => {
                    const isActive = location.pathname.startsWith(link.to);
                    
                    if (link.highlight) {
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex flex-col items-center justify-center -mt-4 p-2 rounded-full w-14 h-14 transition duration-200 shadow-xl 
                                    ${
                                        isActive 
                                            ? 'bg-green-700 text-white ring-4 ring-green-300' 
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                <link.Icon className="w-7 h-7" /> 
                                <span className="sr-only">{link.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex flex-col items-center p-1 pt-2 transition duration-150 flex-1
                                ${
                                    isActive 
                                        ? 'text-green-700 font-bold border-t-2 border-green-700 -mt-2 pt-1' // Borda superior para indicar ativo
                                        : 'text-gray-500 hover:text-green-600'
                                }`}
                        >
                            <link.Icon className="w-6 h-6" /> 
                            <span className="text-xs font-medium mt-0.5">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}