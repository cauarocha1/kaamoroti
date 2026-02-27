import Layout from "../componentes/Layout";
import { useAutenticacao } from "../contextos/AutenticacaoContexto";
import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    getDocs, 
    
} from "firebase/firestore";
import { db } from "../servicos/firebase";
import { useState, useEffect } from "react";
import { Loader2, Trophy, Crown, HandCoins } from 'lucide-react';

interface RankUser {
    uid: string;
    nome: string;
    
    pontosTotais: number; 
}

interface FirestoreUserDoc {
    nome: string;
    pontosTotais: number;
    
    [key: string]: any; 
}

export default function Ranking() {
    const { usuarioLogado } = useAutenticacao();
    const [ranking, setRanking] = useState<RankUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            setLoading(true);
            try {
                
                const usersRef = collection(db, "usuarios");
                const q = query(
                    usersRef, 
                    
                    orderBy("pontosTotais", "desc"), 
                    limit(100)
                );

                const querySnapshot = await getDocs(q);
                
                const rankData: RankUser[] = [];
                querySnapshot.forEach((doc) => {
                    
                    const data = doc.data() as FirestoreUserDoc;
                    
                    
                    
                    if (data.nome && typeof data.pontosTotais === 'number' && data.pontosTotais > 0) {
                        rankData.push({
                            uid: doc.id,
                            nome: data.nome,
                            
                            pontosTotais: data.pontosTotais,
                        });
                    }
                });

                setRanking(rankData);

            } catch (error) {
                console.error("Erro ao carregar o ranking:", error);
            }
            setLoading(false);
        };

        
        if (usuarioLogado) {
            fetchRanking();
        } else {
            setLoading(false);
        }
    }, [usuarioLogado]);


    
    const getRankStyles = (index: number) => {
        switch (index) {
            case 0: return "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 font-extrabold shadow-lg scale-[1.01]";
            case 1: return "bg-gray-100 border-l-4 border-gray-400 text-gray-800 font-bold";
            case 2: return "bg-amber-100 border-l-4 border-amber-600 text-amber-800 font-bold";
            default: return "bg-white border-b border-gray-100 text-gray-700";
        }
    };

 
    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700"/>
                    <div className="ml-3 text-green-700 font-semibold">
                        Carregando o Ranking Global...
                    </div>
                </div>
            </Layout>
        );
    }
    
    
    const userRankIndex = ranking.findIndex(user => user.uid === usuarioLogado?.uid);
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
    const userProgress = userRankIndex !== -1 ? ranking[userRankIndex] : null;


    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                
                
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold text-green-800 flex items-center justify-center space-x-3">
                        <Trophy className="w-10 h-10 text-green-600"/>
                        <span>Ranking Global Ka'a Morotĩ</span>
                    </h1>
                    <p className="mt-2 text-xl text-gray-600">
                        Os maiores defensores do planeta, ranqueados por <span className="font-bold text-green-700">Pontos de Ação (PA)</span>.
                    </p>
                </header>

                
                {userProgress && (
                    <div className="bg-green-700 text-white p-6 rounded-xl shadow-2xl flex justify-between items-center transform scale-100 border-b-4 border-yellow-500">
                        <div>
                            <p className="text-sm font-medium opacity-80">Sua Posição Atual</p>
                            <p className="text-4xl font-extrabold flex items-center space-x-2">
                                {userRank === 1 ? <Crown className="w-8 h-8 text-yellow-300"/> : `#${userRank}`} 
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium opacity-80">Seus Pontos de Ação</p>
                            <p className="text-3xl font-extrabold flex items-center space-x-2 justify-end">
                                <span>{userProgress.pontosTotais.toLocaleString('pt-BR')}</span> 
                                <HandCoins className="w-6 h-6 text-yellow-300"/>
                            </p>
                        </div>
                    </div>
                )}
                
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider w-1/12">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider w-6/12">
                                    Defensor
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-green-700 uppercase tracking-wider w-5/12">
                                    Pontos de Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {ranking.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        Nenhum defensor com pontos ainda. Complete um desafio para aparecer aqui!
                                    </td>
                                </tr>
                            ) : (
                                ranking.map((user, index) => {
                                    const isCurrentUser = user.uid === usuarioLogado?.uid;
                                    const rankStyles = getRankStyles(index);
                                    
                                    return (
                                        <tr 
                                            key={user.uid} 
                                            
                                            className={`${rankStyles} ${isCurrentUser ? 'border-r-4 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                
                                                {index === 0 ? <Crown className="w-5 h-5 inline text-yellow-500"/> : `#${index + 1}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {user.nome} {isCurrentUser && <span className="text-blue-500 text-xs font-bold">(Você)</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-right flex justify-end items-center space-x-1">
                                                <span>{user.pontosTotais.toLocaleString('pt-BR')}</span>
                                                <HandCoins className="w-4 h-4"/>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </Layout>
    );
}