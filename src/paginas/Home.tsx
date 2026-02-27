import Layout from "../componentes/Layout";
import { useAutenticacao } from "../contextos/AutenticacaoContexto"; 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { 
    ArrowRight, Leaf, Zap, Globe, Recycle, HandCoins, CheckCircle, Clock, Loader2, Target, Users, TrendingUp, LogIn, UserPlus, MapPin, Share2
} from 'lucide-react'; 

import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore"; 
import { db } from "../servicos/firebase";



interface UltimoQuizData {
    pontuacao: number; 
    percentual: number; 
    timestamp: Timestamp; 
    [key: string]: any; 
}

interface UltimoQuiz {
    pontuacao: number; 
    data: Date | null; 
}

const dadosImpacto = [
    { 
        titulo: "Consumo de Água e Desperdício", 
        estatistica: "116 litros/pessoa/dia é a média de uso das famílias, mas mais de 40% da água potável é perdida na distribuição antes de chegar às residências.", 
        icone: Zap, 
        cor: "text-blue-600",
        fonte: "Fonte: IBGE/ANA e Trata Brasil"
    },
    { 
        titulo: "Lixo e Destinação Incorreta", 
        estatistica: "O brasileiro gera cerca de 1,04 kg de resíduos por dia. O mais alarmante: 31,9% dos municípios ainda despejam o lixo em lixões (MUNIC 2023).", 
        icone: Recycle, 
        cor: "text-orange-600",
        fonte: "Fonte: ABREMA e IBGE (MUNIC)"
    },
    { 
        titulo: "Emissões do Transporte", 
        estatistica: "O setor de Transporte é a maior fonte de emissões na matriz de Energia, respondendo por 44% dos gases de efeito estufa (GEE) do setor.", 
        icone: Globe, 
        cor: "text-green-600",
        fonte: "Fonte: SEEG/IEMA (2023)"
    },
];

const dadosProposito = [
    { 
        titulo: "O Seu Score Ambiental", 
        descricao: "Transformamos hábitos complexos em uma pontuação percentual clara e objetiva. Você não apenas mede, você entende onde precisa melhorar.", 
        icone: Target,
        cor: "text-red-500" 
    },
    { 
        titulo: "Ação Imediata e Recompensas", 
        descricao: "Complete desafios diários e semanais, ganhe Pontos de Ação (PA) e suba no ranking. Sua evolução é visível e recompensada.", 
        icone: HandCoins,
        cor: "text-yellow-600"
    },
    { 
        titulo: "Progresso Mensurável", 
	descricao: "Visualize a redução do seu impacto ao longo do tempo. O Ka'a Morotĩ é a única plataforma focada em transformar consciência em dados reais de mudança.", 
        icone: TrendingUp,
        cor: "text-blue-600"
    },
];

const dadosRoadmap = [
    {
        titulo: "Integração Social e Compartilhamento",
        descricao: "Permitir que usuários compartilhem seus resultados e progresso diretamente nas redes sociais, ampliando o alcance da conscientização.",
        icone: Share2,
        cor: "text-blue-500"
    },
    {
        titulo: "Geolocalização de Desafios",
        descricao: "Desafios baseados em localização para incentivar ações ambientais em sua comunidade ou bairro, como mutirões de limpeza ou pontos de coleta.",
        icone: MapPin,
        cor: "text-red-500"
    },
    {
        titulo: "Relatórios de Impacto Coletivo",
	descricao: "Visualização do impacto somado de toda a comunidade Ka'a Morotĩ, mostrando a redução real de consumo e emissões em escala.",
        icone: Users,
        cor: "text-green-500"
    },
];


export default function Home() {
    const { usuarioLogado, usuarioData, carregandoDados } = useAutenticacao();
    const navigate = useNavigate();

    const [ultimoQuiz, setUltimoQuiz] = useState<UltimoQuiz | null>(null);
    const [loadingQuiz, setLoadingQuiz] = useState(true);

    
    useEffect(() => {
        if (!usuarioLogado) {
            setLoadingQuiz(false); 
            return;
        }

        const uid = usuarioLogado.uid;
        const quizCollectionRef = collection(db, "usuarios", uid, "historico_quiz");
        const quizQuery = query(quizCollectionRef, orderBy("timestamp", "desc"), limit(1));

        const unsubscribeQuiz = onSnapshot(quizQuery, (querySnap) => {
            if (!querySnap.empty) {
                const quizData = querySnap.docs[0].data() as UltimoQuizData;
                const percentualEncontrado = quizData.percentual ?? 0;
                
                setUltimoQuiz({
                    pontuacao: percentualEncontrado, 
                    data: quizData.timestamp?.toDate() || null, 
                });
            } else {
                setUltimoQuiz(null); 
            }
            setLoadingQuiz(false);
        }, (error) => {
            console.error("Erro no listener de quiz:", error);
            setLoadingQuiz(false);
        });

        return () => {
            unsubscribeQuiz();
        };
        
    }, [usuarioLogado]); 
    
    const isDashboardLoading = carregandoDados || loadingQuiz;
      
    
    if (usuarioLogado && isDashboardLoading) {
        return (
            <Layout> 
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700"/>
                    <div className="ml-3 text-green-700 font-semibold">
                        Carregando seu progresso...
                    </div>
                </div>
            </Layout>
        );
    }

    const temProgresso = (usuarioData && usuarioData.pontosTotais > 0) || 
                          (Array.isArray(usuarioData?.desafiosConcluidos) && usuarioData.desafiosConcluidos.length > 0) || 
                          ultimoQuiz !== null;

    return (
        <Layout hideNav={!usuarioLogado}> 
    
            <div className="flex flex-col min-h-screen">
                
                
                <div className="max-w-6xl mx-auto w-full p-4 lg:p-10 space-y-16 flex-grow">
                
            
                    
                    {usuarioLogado ? (
                        temProgresso ? (
                                        
                            <> 
                                <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border-l-8 border-green-600 space-y-4 md:space-y-6">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">
                                        Dashboard, {usuarioLogado?.displayName?.split(' ')[0] || "Defensor"}!
                                    </h1>
                                    <p className="text-base md:text-xl text-gray-700">
                                        Sua evolução em impacto ambiental em um resumo rápido.
                                    </p>

                                    <div className="grid sm:grid-cols-3 gap-4 md:gap-6 pt-2 md:pt-4">
                                        
                                        
                                        <div className="bg-yellow-50 p-4 rounded-lg shadow-md flex items-center space-x-3">
                                            <HandCoins className="w-8 h-8 text-yellow-600" />
                                            <div>
                                                <p className="text-xs font-medium text-gray-600">Pontos de Ação</p>
                                                <p className="text-2xl font-bold text-yellow-800">
                                                    {usuarioData?.pontosTotais?.toLocaleString('pt-BR') || 0} <span className="text-lg">PA</span>
                                                </p>
                                            </div>
                                        </div>

                                        
                                        <div className="bg-green-50 p-4 rounded-lg shadow-md flex items-center space-x-3">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                            <div>
                                                <p className="text-xs font-medium text-gray-600">Desafios Concluídos</p>
                                                <p className="text-2xl font-bold text-green-800">
                                                    {usuarioData?.desafiosConcluidos?.length ?? 0}
                                                </p>
                                            </div>
                                        </div>

                                        
                                        <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-8 h-8 text-blue-600" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-600">Último Quiz</p>
                                                    <p className="text-2xl font-bold text-blue-800">
                                                        {ultimoQuiz?.pontuacao !== undefined && ultimoQuiz.pontuacao !== null ? `${ultimoQuiz.pontuacao}%` : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            {ultimoQuiz?.data && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {ultimoQuiz.data.toLocaleDateString('pt-BR')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
            
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                                    <button
                                        onClick={() => navigate("/desafios")}
                                        className="flex-1 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition shadow-md"
                                    >
                                        Ver Próximos Desafios
                                    </button>
                                    <button
                                        onClick={() => navigate("/quiz")}
                                        className="flex-1 py-3 border border-green-700 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition shadow-md"
                                    >
                                        Refazer o Quiz
                                    </button>
                                </div>
                            </>
                        ) : (
                            
                            <header className="text-center py-10 md:py-16 bg-white rounded-xl shadow-lg border-t-4 border-green-600">
										<h1 className="text-3xl md:text-5xl font-extrabold text-green-800 tracking-tight">
											Seja um <span className="text-green-600">Ka'a Morotĩ</span> <Leaf className="inline w-8 h-8 md:w-12 md:h-12 align-middle"/>
										</h1>
                                <p className="mt-3 md:mt-4 text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto">
                                    Olá, <strong>{usuarioLogado?.displayName || "Defensor"}</strong>! Descubra e <strong>reduza o seu impacto ambiental</strong>
                                    com dicas práticas e personalizadas.
                                </p>

                                <button
                                    onClick={() => navigate("/quiz")}
                                    className="mt-6 md:mt-8 inline-flex items-center space-x-2 px-8 md:px-10 py-3 md:py-4 bg-green-700 text-white text-lg md:text-xl font-bold rounded-full hover:bg-green-600 transition duration-300 shadow-xl transform hover:scale-105"
                                >
                                    <span>Descubra Sua Pontuação Agora!</span>
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </header>
                        )
                    ) : (
                        
                        <div className="text-center py-12 md:py-20 bg-green-800 text-white rounded-xl shadow-2xl space-y-6 md:space-y-8">
										<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
											Ka'a Morotĩ: Sua Jornada de Impacto Começa Aqui!
										</h1>
                            <p className="mt-2 md:mt-4 text-base md:text-xl font-light max-w-4xl mx-auto px-4">
                                Quer descobrir sua pegada ecológica, participar de desafios gamificados e subir no ranking de defensores do meio ambiente? 
                                É rápido e simples para começar sua mudança de hábitos sustentáveis.
                            </p>

            
                            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-4 px-4">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="inline-flex items-center justify-center space-x-3 px-8 py-3 bg-green-600 text-white text-lg font-bold rounded-full hover:bg-green-500 transition duration-300 shadow-xl transform hover:scale-105"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Fazer Login</span>
                                </button>
                                <button
                                    onClick={() => navigate("/cadastro")}
                                    className="inline-flex items-center justify-center space-x-3 px-8 py-3 bg-yellow-400 text-green-900 text-lg font-bold rounded-full hover:bg-yellow-300 transition duration-300 shadow-xl transform hover:scale-105"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span>Criar Conta (Grátis!)</span>
                                </button>
                            </div>
                        </div>
                    )}
                    
            
                    
            
                    <section className="space-y-6 md:space-y-8 pt-8">
				<h2 className="text-2xl md:text-4xl font-extrabold text-green-800 text-center">
					O Que é o Ka'a Morotĩ?
				</h2>
				<p className="text-center text-lg md:text-xl text-gray-700 max-w-5xl mx-auto font-medium">
					O nome deriva do Tupi-Guarani: Ka'a ('mata') e Morotĩ ('branco' ou 'limpo'), simbolizando uma 'floresta limpa'. Nossa plataforma transforma a avaliação em um processo motivador e recompensador.
				</p>
                        
                        <div className="grid sm:grid-cols-3 gap-6 pt-4">
                            {dadosProposito.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition duration-300"
                                >
                                    <div className="flex items-start space-x-3 mb-3">
                                        <item.icone className={`w-7 h-7 ${item.cor} flex-shrink-0`} /> 
                                        <h3 className="text-lg font-bold text-gray-800 mt-[-2px]">{item.titulo}</h3>
                                    </div>
                                    <p className="mt-1 text-gray-600 leading-relaxed text-sm">{item.descricao}</p>
                                </div>
                            ))}
                        </div>
                    </section>

            
                    <section className="bg-gray-50 p-8 md:p-10 rounded-xl shadow-inner space-y-6 md:space-y-8">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 text-center">
                            O Que Dizem Nossos Defensores
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-2 border-yellow-500">
                                <p className="text-gray-600 italic">"Consegui identificar rapidamente onde eu desperdiçava mais energia. O sistema de pontos me motivou a ir além do quiz!"</p>
                                <p className="mt-3 text-sm font-semibold text-yellow-700">- Usuário BETA (Bauru/SP)</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md border-t-2 border-yellow-500">
                                <p className="text-gray-600 italic">"É a primeira vez que vejo um projeto que une educação ambiental com gamificação de forma tão eficaz. Aguardando os desafios de geolocalização!"</p>
                                <p className="mt-3 text-sm font-semibold text-yellow-700">- Prof. Marina A. (Educadora Ambiental)</p>
                            </div>
                        </div>
                    </section>

            
                    <section className="space-y-6 md:space-y-8 pt-8">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-green-800 text-center">
                            Os Desafios Reais no Brasil
                            
                        </h2>
                        <p className="text-center text-lg md:text-xl text-gray-700 max-w-5xl mx-auto font-medium">
                            Sua Pegada Ecológica contribui para o panorama nacional. Estes são os desafios ambientais que precisamos reverter com a mudança de hábitos:
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 pt-4">
                            {dadosImpacto.map((dado, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition duration-300">
                                    <div className="flex items-start space-x-3 mb-3">
                                        <dado.icone className={`w-7 h-7 ${dado.cor} flex-shrink-0`} />
                                        <h3 className="text-lg font-bold text-gray-800 mt-[-2px]">{dado.titulo}</h3>
                                    </div>
                                    <p className="mt-1 text-gray-600 leading-relaxed text-sm">{dado.estatistica}</p>
                                    <p className="mt-3 text-xs text-gray-500 italic border-t border-gray-100 pt-2">
                                        {dado.fonte}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

            
                    <section className="space-y-6 md:space-y-8 pt-8 bg-green-900 p-8 rounded-xl text-white shadow-2xl">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-white text-center">
                            Nossa Visão de Futuro
                        </h2>
				<p className="text-center text-lg md:text-xl font-light max-w-5xl mx-auto">
					O Ka'a Morotĩ está em constante evolução. Temos um plano claro para expandir a plataforma e ampliar o impacto coletivo.
				</p>
                        
                        <div className="grid sm:grid-cols-3 gap-6 pt-4">
                            {dadosRoadmap.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="bg-green-800 p-5 rounded-lg shadow-xl border-b-4 border-yellow-400"
                                >
                                    <div className="flex items-start space-x-3 mb-3">
                                        <item.icone className={`w-7 h-7 ${item.cor} flex-shrink-0`} /> 
                                        <h3 className="text-lg font-bold text-white mt-[-2px]">{item.titulo}</h3>
                                    </div>
                                    <p className="mt-1 text-gray-300 leading-relaxed text-sm">{item.descricao}</p>
                                </div>
                            ))}
                        </div>
                    </section>


            
                    <section className="text-center bg-yellow-50 p-8 md:p-10 rounded-xl shadow-xl space-y-5 md:space-y-6">
                        <Users className="w-10 h-10 md:w-12 md:h-12 text-yellow-700 mx-auto" />
                        <h2 className="text-2xl md:text-4xl font-extrabold text-yellow-800">
                            Junte-se à Nossa Comunidade
                        </h2>
                        <p className="text-base md:text-xl text-gray-700 max-w-4xl mx-auto">
                            O sistema possui um ranking de usuários que estimula o engajamento coletivo. Concorra no ranking de Pontos de Ação (PA) e inspire outros.
                        </p>
                        <button
                            onClick={() => navigate(usuarioLogado ? "/ranking" : "/login")}
                            className="mt-6 inline-flex items-center space-x-2 px-8 py-3 bg-yellow-600 text-white text-lg font-bold rounded-full hover:bg-yellow-700 transition duration-300 shadow-lg transform hover:scale-105"
                        >
                            <span>{usuarioLogado ? "Ver o Ranking Global" : "Entre para Ver o Ranking"}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </section>


            
                    <section className="bg-green-50 p-6 md:p-8 rounded-xl shadow-inner space-y-5 md:space-y-6">
                        <h2 className="text-xl md:text-3xl font-bold text-green-800 text-center">Como Transformamos Conscientização em Ação?</h2>
                        
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <Zap className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-3" />
                                <h3 className="font-bold text-lg">1. Responda o Quiz</h3>
                                <p className="text-sm text-gray-600 mt-1">A metodologia baseia-se no quiz de pegada ecológica, que é a sua avaliação inicial.</p>
                            </div>
                            <div className="text-center p-4">
                                <Globe className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-3" />
                                <h3 className="font-bold text-lg">2. Participe dos Desafios</h3>
                                <p className="text-sm text-gray-600 mt-1">Realize desafios com relato textual para consolidar o ciclo educativo e sustentável.</p>
                            </div>
                            <div className="text-center p-4">
                                <Leaf className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-3" />
                                <h3 className="font-bold text-lg">3. Acompanhe Seu Progresso</h3>
                                <p className="text-sm text-gray-600 mt-1">Acompanhe sua pontuação e mudança de hábitos, estimulando sua evolução.</p>
                            </div>
                        </div>
                    </section>

            
                    {!temProgresso && usuarioLogado && (
                        <div className="text-center pb-8 pt-4">
                            <button
                                onClick={() => navigate("/quiz")}
                                className="inline-flex items-center space-x-2 px-10 py-4 bg-green-700 text-white text-xl font-bold rounded-full hover:bg-green-600 transition duration-300 shadow-xl transform hover:scale-105"
                            >
                                <span>Começar a Mudança Agora</span>
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

            
				<footer className="bg-gray-800 text-white p-6 md:p-8 w-full">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
						<p className="text-center md:text-left mb-4 md:mb-0">
							© 2025 Ka'a Morotĩ - Plataforma Interativa para Conscientização Ambiental.
						</p>
                        <div className="flex space-x-6 justify-center">
                            <a href="#" className="hover:text-green-400 transition">Sobre</a>
                            <a href="#" className="hover:text-green-400 transition">Termos de Uso</a>
                            
                            <a href="/contato" className="hover:text-green-400 transition">Contato</a> 
                        </div>
                    </div>
                </footer>

            </div>
        </Layout>
    );
}