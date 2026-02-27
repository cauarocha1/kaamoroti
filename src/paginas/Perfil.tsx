import { useState, useEffect } from "react";
import { useAutenticacao } from "../contextos/AutenticacaoContexto"; 
import Layout from "../componentes/Layout";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../servicos/firebase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HandCoins, Zap, User, Clock, CheckCircle, Target, Settings, Loader2 } from 'lucide-react'; 
import { Link } from 'react-router-dom';

import { sugestoesMapeadas } from "../utils/quizMapping"; 


 

interface QuizHistorico {
    id: string;
    pontuacao: number; 
    percentual: number; 
    tagsBaixaPontuacao: string[]; 
    data: string; 
    timestamp: any;
    type: 'quiz'; 
}

interface DesafioConcluidoHistorico {
    id: string;
    idDesafio: string; 
    titulo: string;
    pontosGanhos: number;
    timestamp: any; 
    type: 'desafio'; 
}

interface PerfilData {
    pontosTotais: number; 
    historicoQuiz: QuizHistorico[];
    desafiosConcluidos: string[]; 
    historicoDesafios: DesafioConcluidoHistorico[];
    ultimoQuiz?: QuizHistorico; 
}

 

export default function Perfil() {
    const { usuarioLogado, usuarioData, carregandoDados } = useAutenticacao(); 
    
        const [loading, setLoading] = useState(false); 
    const [perfilData, setPerfilData] = useState<PerfilData>({
        pontosTotais: 0, 
        historicoQuiz: [],
        desafiosConcluidos: [],
        historicoDesafios: [],
    });

    useEffect(() => {
        
        if (!usuarioLogado || carregandoDados) {
            if (!usuarioLogado) setLoading(false);
            return;
        }

        const fetchDadosPerfil = async () => {
            
            setLoading(true); 
            const uid = usuarioLogado.uid;
            
            
            let pontosTotais = usuarioData?.pontosTotais || 0;
            let desafiosConcluidos: string[] = Array.isArray(usuarioData?.desafiosConcluidos) 
                                               ? usuarioData.desafiosConcluidos 
                                               : [];
            
            
            if (!usuarioData) {
                 try {
                     const userRef = doc(db, "usuarios", uid);
                     const userSnap = await getDoc(userRef);
                     if (userSnap.exists()) {
                         const data = userSnap.data();
                         pontosTotais = data.pontosTotais || 0;
                         desafiosConcluidos = Array.isArray(data.desafiosConcluidos) ? data.desafiosConcluidos : [];
                     }
                 } catch (error) {
                     console.error("Erro ao carregar dados principais (fallback):", error);
                 }
            }


            
            let historicoQuiz: QuizHistorico[] = [];
            let historicoDesafios: DesafioConcluidoHistorico[] = [];
            let ultimoQuiz: QuizHistorico | undefined = undefined; 

            try {
                
                const quizColRef = collection(db, "usuarios", uid, "historico_quiz"); 
                
                
                const quizQuery = query(quizColRef, orderBy("timestamp", "asc"), limit(10));
                const quizSnaps = await getDocs(quizQuery);

                historicoQuiz = quizSnaps.docs.map((doc, index) => {
                    const data = doc.data();
                    const percentual = data.percentual || 0;
                    const tagsBaixaPontuacao = data.tagsBaixaPontuacao || [];

                    return {
                        id: doc.id,
                        pontuacao: percentual,
                        percentual: percentual,
                        tagsBaixaPontuacao: tagsBaixaPontuacao,
                        data: `Q${index + 1}`, 
                        timestamp: data.timestamp,
                        type: 'quiz' as const,
                    };
                });
                
                
                const latestQuizQuery = query(quizColRef, orderBy("timestamp", "desc"), limit(1));
                const latestQuizSnap = await getDocs(latestQuizQuery);

                if (!latestQuizSnap.empty) {
                    const data = latestQuizSnap.docs[0].data();
                    ultimoQuiz = {
                        id: latestQuizSnap.docs[0].id,
                        pontuacao: data.pontuacao || 0,
                        percentual: data.percentual || 0,
                        tagsBaixaPontuacao: data.tagsBaixaPontuacao || [],
                        data: 'Recente',
                        timestamp: data.timestamp,
                        type: 'quiz' as const,
                    };
                }

                
                const desafiosColRef = collection(db, "usuarios", uid, "desafios_concluidos");
                const desafiosQuery = query(desafiosColRef, orderBy("dataConclusao", "desc"), limit(10)); 
                const desafiosSnaps = await getDocs(desafiosQuery);

                historicoDesafios = desafiosSnaps.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        idDesafio: data.idDesafio,
                        titulo: data.titulo,
                        pontosGanhos: data.pontosGanhos,
                        timestamp: data.dataConclusao, 
                        type: 'desafio' as const,
                    };
                });

                setPerfilData({
                    pontosTotais,
                    historicoQuiz,
                    desafiosConcluidos,
                    historicoDesafios,
                    ultimoQuiz,
                });

            } catch (error) {
                console.error("Erro ao carregar subcoleções do perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDadosPerfil();
    }, [usuarioLogado, usuarioData, carregandoDados]);

    
    const sugestoesPlanoAcao = perfilData.ultimoQuiz?.tagsBaixaPontuacao
        ?.map(tag => sugestoesMapeadas[tag] || null)
        .filter((s): s is string => s !== null) || [];

    
    const historicoCombinado = [...perfilData.historicoQuiz, ...perfilData.historicoDesafios]
        .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
        .slice(0, 5);

    
    const formatDate = (timestamp: any) => {
        if (!timestamp || !timestamp.toDate) return 'N/A';
        const date = timestamp.toDate();
        return date.toLocaleDateString('pt-BR');
    };

    const tooltipFormatter = (value: any, _: any, _props: any) => 
        [`${value}%`, `Conscientização no Quiz`];
        
    const labelFormatter = (label: any) => `Quiz: ${label}`;


    
    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700"/>
                    <div className="ml-3 text-green-700 font-semibold">
                        Carregando seu Perfil e Histórico...
                    </div>
                </div>
            </Layout>
        );
    }

    const { historicoQuiz, pontosTotais, desafiosConcluidos } = perfilData; 

    
    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
                
                
                <header className="flex justify-between items-start">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center space-x-3">
                            <User className="w-8 h-8 text-green-600"/>
                            <span>Meu Perfil e Progresso</span>
                        </h1>
                        <p className="text-xl text-gray-600 mt-2">
                            {usuarioLogado?.displayName || "Usuário"} | {usuarioLogado?.email}
                        </p>
                    </div>
                    
                    
                    <Link 
                        to="/configuracoes" 
                        className="p-2 mt-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
                        title="Ajustes e Configurações"
                    >
                        <Settings className="w-7 h-7"/>
                    </Link>
                </header>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-100 p-6 rounded-xl shadow-lg border-l-8 border-green-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Total de Pontos de Ação (PA)</p>
                            <p className="text-4xl font-extrabold text-green-800 flex items-center space-x-3 mt-1">
                                <span>{pontosTotais.toLocaleString('pt-BR')}</span> 
                                <HandCoins className="w-8 h-8 text-yellow-600"/>
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-blue-100 p-6 rounded-xl shadow-lg border-l-8 border-blue-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Desafios Concluídos</p>
                            <p className="text-4xl font-extrabold text-blue-800 flex items-center space-x-3 mt-1">
                                <CheckCircle className="w-8 h-8 text-blue-600"/> 
                                <span>{desafiosConcluidos.length}</span>
                            </p>
                        </div>
                    </div>
                </div>

                
                {perfilData.ultimoQuiz ? (
                    <section className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-yellow-500">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2 mb-4">
                            <Target className="w-6 h-6 text-yellow-600"/>
                            <span>Seu Plano de Ação Personalizado</span>
                        </h2>
                        <p className="mb-4 text-lg font-semibold text-gray-700">
                            Seu Índice de Sustentabilidade Pessoal: <span className="text-green-600">{perfilData.ultimoQuiz.percentual}%</span>
                        </p>
                        
                        {sugestoesPlanoAcao.length > 0 ? (
                            <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700">
                                {sugestoesPlanoAcao.map((sugestao, index) => (
                                    <li key={index} className="text-base font-medium">
                                        {sugestao}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-green-600 font-medium">
                                Parabéns! Seu impacto ambiental é muito baixo. Você é um Defensor Ka'a Morotĩ. Mantenha os bons hábitos e continue completando os desafios!
                            </p>
                        )}
                        <Link 
                            to="/desafios"
                            className="inline-block mt-4 py-2 px-4 bg-green-700 text-white rounded-lg font-bold hover:bg-green-600 transition"
                        >
                            Ir para os Desafios
                        </Link>
                    </section>
                ) : (
                    <section className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-yellow-500">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2 mb-4">
                            <Target className="w-6 h-6 text-yellow-600"/>
                            <span>Gere seu Plano de Ação</span>
                        </h2>
                        <p className="text-gray-600">
                            Faça o Quiz Ka'a Morotĩ para gerar seu Plano de Ação Personalizado e ver seus pontos de melhoria, que se tornarão seus primeiros desafios!
                        </p>
                        <Link 
                            to="/quiz"
                            className="inline-block mt-4 py-2 px-4 bg-green-700 text-white rounded-lg font-bold hover:bg-green-600 transition"
                        >
                            Começar Quiz
                        </Link>
                    </section>
                )}

                
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2 mb-4">
                        <Zap className="w-6 h-6 text-indigo-500"/>
                        <span>Evolução da Conscientização (Quizzes)</span>
                    </h2>
                    
                    {historicoQuiz.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={historicoQuiz}
                                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="data" stroke="#4b5563" />
                                    <YAxis 
                                        domain={[0, 100]} 
                                        tickFormatter={(tick) => `${tick}%`}
                                        stroke="#4b5563"
                                    />
                                    <Tooltip 
                                        formatter={tooltipFormatter} 
                                        labelFormatter={labelFormatter}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="pontuacao" 
                                        name="Índice de Sustentabilidade"
                                        stroke="#10B981" 
                                        strokeWidth={3} 
                                        dot={{ r: 6 }} 
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500 py-4">
                            Nenhum Quiz concluído ainda. Participe do primeiro Quiz para ver sua evolução aqui!
                        </p>
                    )}
                </section>
                
                
                <section className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2 mb-4">
                        <Clock className="w-6 h-6 text-gray-500"/>
                        <span>Histórico de Atividades Recentes</span>
                    </h2>
                    
                    {historicoCombinado.length > 0 ? (
                        <ul className="space-y-3">
                            {historicoCombinado.map((item) => (
                                <li key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                        {item.type === 'quiz' ? (
                                            <Zap className="w-5 h-5 text-indigo-500"/>
                                        ) : (
                                            <Target className="w-5 h-5 text-green-500"/> 
                                        )}
                                        <span className="font-semibold text-gray-700">
                                            {item.type === 'quiz' 
                                                ? `Quiz Concluído (${item.data})` 
                                                : `Desafio Concluído: ${item.titulo}`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-1 md:mt-0">
                                        
                                        <span className={`font-bold text-sm ${item.type === 'quiz' && item.pontuacao >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {item.type === 'quiz' ? `${item.pontuacao}%` : `+${item.pontosGanhos} PA`}
                                        </span>
                                        
                                        <span className="text-xs text-gray-500">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">O seu histórico de atividades será exibido aqui após concluir seu primeiro Quiz ou Desafio.</p>
                    )}
                </section>
            </div>
        </Layout>
    );
}