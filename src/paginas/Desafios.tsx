import Layout from "../componentes/Layout";
import { 
    HandCoins, Droplet, Bike, Lightbulb, Recycle, Target, DollarSign, CheckCircle,
    Utensils, Leaf, Loader2, AlertTriangle, X
} from 'lucide-react';
import { useAutenticacao } from "../contextos/AutenticacaoContexto";
import { 
    doc, serverTimestamp, getDoc, runTransaction
} from "firebase/firestore"; 
import { db } from "../servicos/firebase";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; 

interface Desafio {
    id: string; 
    titulo: string;
    subtitulo: string;
    meta: string;
    pontos: number;
    icone: React.ElementType; 
    cor: string;
    ods: string;
    tagNecessaria: string; 
}

interface UserProgress {
    pontosTotais: number; 
    desafiosConcluidos: string[];
}

 
const todosOsDesafios: Desafio[] = [ 
    
    { id: "banho_rapido_5m", titulo: "Banho de 5 Minutos", subtitulo: "Economia Hídrica", meta: "Mantenha o tempo do seu banho em no máximo 5 minutos por 7 dias. Use um cronômetro!", pontos: 150, icone: Droplet, cor: "border-blue-500 bg-blue-50", ods: "ODS 6: Água Limpa e Saneamento", tagNecessaria: "desperdicio_agua" },
    { id: "segunda_sem_carne", titulo: "Segunda Sem Carne", subtitulo: "Alimentação Consciente", meta: "Passe uma semana sem consumir carne vermelha (boi, porco).", pontos: 175, icone: Utensils, cor: "border-red-500 bg-red-50", ods: "ODS 12: Consumo e Produção Responsáveis", tagNecessaria: "alto_carbono" },
    { id: "transporte_zero_co2", titulo: "Transporte Zero CO2", subtitulo: "Mobilidade Sustentável", meta: "Use bicicleta, transporte público ou vá a pé para o trabalho/faculdade por 3 dias.", pontos: 200, icone: Bike, cor: "border-green-500 bg-green-50", ods: "ODS 13: Ação Contra a Mudança Global do Clima", tagNecessaria: "emissao_co2" },
    { id: "adeus_standby", titulo: "Adeus Stand-by", subtitulo: "Eficiência Energética", meta: "Desligue todos os aparelhos da tomada (ou use réguas) antes de dormir por 5 noites.", pontos: 100, icone: Lightbulb, cor: "border-yellow-500 bg-yellow-50", ods: "ODS 7: Energia Limpa e Acessível", tagNecessaria: "consumo_fantasma" },
    { id: "dia_sem_plastico_unico", titulo: "Dia Sem Plástico Único", subtitulo: "Redução de Resíduos", meta: "Passe 24h sem usar qualquer plástico (copo, sacola, embalagem) de uso único.", pontos: 180, icone: Recycle, cor: "border-orange-500 bg-orange-50", ods: "ODS 12: Consumo e Produção Responsáveis", tagNecessaria: "alto_plastico" },
    { id: "compostagem_15dias", titulo: "Mestre Compostador", subtitulo: "Gestão de Lixo Orgânico", meta: "Separe e composte todo seu lixo orgânico por 15 dias.", pontos: 250, icone: Leaf, cor: "border-purple-600 bg-purple-50", ods: "ODS 11: Cidades e Comunidades Sustentáveis", tagNecessaria: "lixo_organico" },
    { id: "feiras_locais", titulo: "Apoio ao Pequeno Produtor", subtitulo: "Consumo Local", meta: "Passe uma semana comprando pelo menos 80% dos alimentos frescos em feiras ou mercados de produtores locais.", pontos: 160, icone: DollarSign, cor: "border-pink-500 bg-pink-50", ods: "ODS 8: Trabalho Decente e Crescimento Econômico", tagNecessaria: "consumo_local" },
    { id: "upcycle_item", titulo: "Reuso Criativo (Upcycle)", subtitulo: "Sustentabilidade e Criatividade", meta: "Transforme uma peça de roupa, móvel ou objeto de plástico que seria descartado em algo novo e útil.", pontos: 220, icone: HandCoins, cor: "border-indigo-500 bg-indigo-50", ods: "ODS 12: Consumo e Produção Responsáveis", tagNecessaria: "reuso_materiais" },
    
    
    
    { id: "zero_desperdicio_alimentos", titulo: "Prato Limpo", subtitulo: "Fome Zero e Resíduos", meta: "Em 10 refeições consecutivas, planeje e consuma 100% da comida, evitando descartar sobras.", pontos: 180, icone: Utensils, cor: "border-red-600 bg-red-100", ods: "ODS 2 & 12: Fome Zero e Consumo Responsável", tagNecessaria: "lixo_organico" },
    
    
    { id: "descarte_lixo_eletronico", titulo: "Fim do E-waste", subtitulo: "Logística Reversa", meta: "Descarte um equipamento eletrônico antigo ou quebrado em um ponto de coleta certificado.", pontos: 220, icone: Recycle, cor: "border-gray-500 bg-gray-100", ods: "ODS 12 & 15: Consumo Responsável e Vida Terrestre", tagNecessaria: "alto_eletronico" },
    
    
    { id: "revisao_iluminacao_led", titulo: "Troca Inteligente", subtitulo: "Eficiência Energética", meta: "Substitua pelo menos 3 lâmpadas incandescentes/fluorescentes por modelos LED.", pontos: 150, icone: Lightbulb, cor: "border-yellow-600 bg-yellow-100", ods: "ODS 7: Energia Limpa e Acessível", tagNecessaria: "consumo_fantasma" },
    
    
    { id: "plantio_muda", titulo: "Guardião da Mata", subtitulo: "Vida Terrestre", meta: "Plante uma muda de árvore (ou participe de um mutirão de reflorestamento) e registre a ação.", pontos: 280, icone: Leaf, cor: "border-green-600 bg-green-100", ods: "ODS 15: Vida Terrestre", tagNecessaria: "desmatamento" },
    
    
    { id: "adeus_copos_descartaveis", titulo: "Meu Kit Reutilizável", subtitulo: "Adeus ao Descartável", meta: "Use seu próprio copo, garrafa e talheres reutilizáveis por 7 dias em locais de consumo.", pontos: 130, icone: HandCoins, cor: "border-indigo-600 bg-indigo-100", ods: "ODS 12: Consumo e Produção Responsáveis", tagNecessaria: "alto_plastico" },
];

 

interface ModalProps {
    desafio: Desafio;
    onClose: () => void;
    
    onSubmit: (evidencia: string) => void; 
    status: 'idle' | 'loading' | 'success' | 'error';
}

const ModalSubmissaoDesafio: React.FC<ModalProps> = ({ desafio, onClose, onSubmit, status }) => {
    const [evidencia, setEvidencia] = useState('');
    
    
    

    
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && status !== 'loading') { 
            onClose();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (evidencia.trim() === '' || status === 'loading') {
            alert("Por favor, descreva brevemente o que você fez para concluir o desafio.");
            return;
        }
        
        onSubmit(evidencia.trim()); 
    };

    
    if (status === 'success') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOutsideClick}>
                <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">Sucesso!</h3>
                    <p className="text-gray-600 mt-2">Seus pontos foram adicionados. Parabéns!</p>
                    <button 
                        onClick={onClose} 
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    >
                        Feche
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOutsideClick}>
                <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-700">Erro!</h3>
                    <p className="text-gray-600 mt-2">Ocorreu um erro ao salvar seu progresso. Por favor, tente novamente.</p>
                    <p className="text-sm text-gray-500 mt-2">Verifique sua conexão.</p>
                    <button 
                        onClick={onClose} 
                        className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
            onClick={handleOutsideClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-green-700 flex items-center">
                        <Target className="w-6 h-6 mr-2"/> 
                        Concluir: {desafio.titulo}
                    </h3>
                    <button onClick={onClose} disabled={status === 'loading'} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">{desafio.meta}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="evidencia" className="block text-sm font-medium text-gray-700">
                            Relato (O que você fez?)
                        </label>
                        <textarea
                            id="evidencia"
                            value={evidencia}
                            onChange={(e) => setEvidencia(e.target.value)}
                            rows={3}
                            placeholder="Ex: 'Usei o cronômetro no banho por 7 dias! Consegui manter 4:30 em média!'"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
                            required
                            disabled={status === 'loading'}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Descreva brevemente sua ação. Este campo é obrigatório.
                        </p>
                    </div>

                    
                    
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-2 font-semibold rounded-md flex items-center justify-center space-x-2 transition 
                            ${status === 'loading'
                                ? 'bg-green-400 text-white cursor-wait'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                            }`}
                    >
                        {status === 'loading' ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> <span>Salvando...</span></>
                        ) : (
                            <><HandCoins className="w-5 h-5"/> <span>Ganhar {desafio.pontos} Pontos de Ação</span></>
                        )}
                    </button>
                    <button type="button" onClick={onClose} disabled={status === 'loading'} className="w-full text-sm mt-2 text-gray-500 hover:text-gray-700">
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

 

export default function Desafios() {
    const { usuarioLogado } = useAutenticacao();
    
    const [progresso, setProgresso] = useState<UserProgress>({ pontosTotais: 0, desafiosConcluidos: [] });
    const [tagsSugeridas, setTagsSugeridas] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [desafioParaSubmeter, setDesafioParaSubmeter] = useState<Desafio | null>(null);
    const [statusSubmissao, setStatusSubmissao] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    
    useEffect(() => {
        if (!usuarioLogado) {
            setLoading(false); 
            return;
        }

        const fetchDados = async () => {
            const userRef = doc(db, "usuarios", usuarioLogado.uid);
            
            try {
                const userSnap = await getDoc(userRef);
                
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    
                    setTagsSugeridas(Array.isArray(data.tagsBaixaPontuacao) ? data.tagsBaixaPontuacao : []); 
                    
                    setProgresso({
                        pontosTotais: data.pontosTotais || 0, 
                        desafiosConcluidos: Array.isArray(data.desafiosConcluidos) ? data.desafiosConcluidos : []
                    });
                } else {
                    setTagsSugeridas([]);
                    setProgresso({ pontosTotais: 0, desafiosConcluidos: [] });
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDados();
    }, [usuarioLogado]);
    
    
    const desafiosSugeridos = useMemo(() => {
        if (tagsSugeridas.length === 0) return []; 
        
        return todosOsDesafios.filter(desafio => 
            tagsSugeridas.includes(desafio.tagNecessaria) && !progresso.desafiosConcluidos.includes(desafio.id)
        );
    }, [tagsSugeridas, progresso.desafiosConcluidos]); 

    const outrosDesafios = useMemo(() => {
        const sugeridosIds = desafiosSugeridos.map(d => d.id);
        
        return todosOsDesafios.filter(desafio => 
            !sugeridosIds.includes(desafio.id) && !progresso.desafiosConcluidos.includes(desafio.id)
        );
    }, [desafiosSugeridos, progresso.desafiosConcluidos]);


    
    const submeterEvidencia = async (evidencia: string) => { 
        if (!usuarioLogado || !desafioParaSubmeter) return;

        setStatusSubmissao('loading');
        
        const desafio = desafioParaSubmeter; 
        const userRef = doc(db, "usuarios", usuarioLogado.uid);
        
        
        
        
        try {
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                
                
                const oldData = userDoc.data() as { 
                    pontosTotais?: number; 
                    desafiosConcluidos?: string[]; 
                    [key: string]: any; 
                } || {};
                
                const currentDesafios = Array.isArray(oldData.desafiosConcluidos) ? oldData.desafiosConcluidos : []; 
                const currentPontos = oldData.pontosTotais || 0; 

                if (currentDesafios.includes(desafio.id)) {
                    throw new Error("Desafio já concluído."); 
                }

                const novosPontos = currentPontos + desafio.pontos;
                const novosDesafios = [...currentDesafios, desafio.id];

                
                transaction.set(userRef, {
                    pontosTotais: novosPontos, 
                    desafiosConcluidos: novosDesafios,
                }, { merge: true }); 
                
                
                const desafioRef = doc(db, "usuarios", usuarioLogado.uid, "desafios_concluidos", desafio.id);
                transaction.set(desafioRef, {
                    idDesafio: desafio.id,
                    titulo: desafio.titulo,
                    pontosGanhos: desafio.pontos,
                    dataConclusao: serverTimestamp(),
                    evidencia: evidencia, 
                    
                });

                
                setProgresso({ pontosTotais: novosPontos, desafiosConcluidos: novosDesafios });
            });
            
            setStatusSubmissao('success');

        } catch (e) { 
            if (e instanceof Error && e.message.includes("Desafio já concluído")) {
                alert("Você já concluiu este desafio!");
                setStatusSubmissao('idle'); 
            } else {
                console.error("Erro ao concluir desafio:", e);
                setStatusSubmissao('error');
            }
        }
    };


    
    const DesafioCard = ({ desafio }: { desafio: Desafio }) => {
        const concluido = progresso.desafiosConcluidos.includes(desafio.id);
        const IconComponent = desafio.icone; 

        const isDisabled = concluido || statusSubmissao === 'loading';

        return (
            <div 
                key={desafio.id} 
                className={`p-6 rounded-lg shadow-lg border-l-8 ${concluido ? 'border-gray-400 bg-gray-100' : desafio.cor} space-y-3 transition transform hover:scale-[1.02]`}
            >
                <div className="flex justify-between items-start">
                    <IconComponent className={`w-8 h-8 ${concluido ? 'text-gray-600' : desafio.cor.replace('bg-', 'text-')}`}/>
                    <div className="text-right">
                        <p className="text-xs font-semibold uppercase text-gray-500">{desafio.subtitulo}</p>
                        <p className="text-lg font-extrabold text-green-700 flex items-center">
                            +{desafio.pontos} <span className="text-sm ml-1">PA</span>
                        </p>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{desafio.titulo}</h3>
                <p className="text-sm text-gray-700 border-l-2 border-gray-400 pl-3 italic">{desafio.meta}</p>
                <p className="text-xs text-gray-500 mt-2 font-medium flex items-center space-x-1">
                    <DollarSign className="w-3 h-3"/>
                    <span>ODS Relacionado: {desafio.ods}</span>
                </p>
                
                <div className="pt-2">
                    <button
                        onClick={() => setDesafioParaSubmeter(desafio)}
                        disabled={isDisabled}
                        className={`w-full py-2 font-semibold rounded-md flex items-center justify-center space-x-2 transition 
                            ${isDisabled 
                                ? 'bg-gray-500 text-white cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                            }`}
                    >
                        <CheckCircle className="w-5 h-5"/>
                        <span>{concluido ? 'Desafio Concluído!' : 'Concluir Desafio'}</span>
                    </button>
                </div>
            </div>
        );
    }

    
    if (loading) {
        return (
            <Layout>
                <div className="text-center p-10 flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-green-600 animate-spin"/>
                    <p className="mt-4 text-xl font-semibold text-green-700">
                        Carregando Desafios...
                    </p>
                </div>
            </Layout>
        );
    }

    const desafiosConcluidosCount = progresso.desafiosConcluidos.length;
    const totalDesafiosCount = todosOsDesafios.length;
    const mostrandoOutrosDesafiosTexto = desafiosSugeridos.length > 0 ? 'Outros Desafios' : 'Desafios Atuais (Comece Aqui!)';

    const todosOsDesafiosConcluidos = desafiosConcluidosCount === totalDesafiosCount;


    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                
                
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold text-green-800 flex items-center justify-center space-x-3">
                        <Target className="w-10 h-10 text-green-600"/>
                        <span>Desafios Ka'a Morotĩ</span>
                    </h1>
                    <p className="mt-2 text-xl text-gray-600">
                        Transforme suas dicas do Perfil em metas reais. Acumule <span className="font-extrabold">Pontos de Ação</span>!
                    </p>
                </header>
                
                
                <div className="bg-green-700 text-white p-6 rounded-xl shadow-xl flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium opacity-80">Seus Pontos de Ação</p>
                        <p className="text-4xl font-extrabold flex items-center space-x-2">
                            <span>{progresso.pontosTotais.toLocaleString('pt-BR')}</span> 
                            <HandCoins className="w-8 h-8 text-yellow-300"/>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium opacity-80">Desafios Concluídos</p>
                        <p className="text-3xl font-bold">{desafiosConcluidosCount} de {totalDesafiosCount}</p>
                    </div>
                </div>
                
                
                
                {desafiosSugeridos.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-2xl font-bold text-green-800">
                                Seu Plano de Ação Personalizado!
                            </h2>
                            <span className="text-sm bg-yellow-400 text-gray-800 font-bold px-2 py-1 rounded-full shadow-sm">
                                Sugeridos pelo Quiz
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Estes desafios foram selecionados com base nas suas respostas de menor pontuação no último Quiz.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            {desafiosSugeridos.map(desafio => (
                                <DesafioCard key={desafio.id} desafio={desafio} />
                            ))}
                        </div>
                    </section>
                )}
                
                
                {outrosDesafios.length > 0 || todosOsDesafiosConcluidos ? (
                    <section className={`space-y-6 ${desafiosSugeridos.length > 0 ? 'pt-8 border-t border-gray-200' : ''}`}>
                        
                        <h2 className="text-2xl font-bold text-gray-800">
                            {outrosDesafios.length > 0 ? mostrandoOutrosDesafiosTexto : 'Parabéns, Você Concluiu Todos!'}
                        </h2>

                        {todosOsDesafiosConcluidos ? (
                            <div className="p-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 flex items-center rounded-lg">
                                <CheckCircle className="w-6 h-6 mr-3"/>
                                <span className="font-semibold">
                                    Você é um Defensor Nível Mestre! Todos os desafios concluídos. Continue revisitando o Quiz!
                                </span>
                            </div>
                        ) : (
                             <div className="grid md:grid-cols-2 gap-6">
                                {outrosDesafios.map(desafio => (
                                    <DesafioCard key={desafio.id} desafio={desafio} />
                                ))}
                             </div>
                        )}
                        
                    </section>
                ) : (
                    
                    <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 flex items-center rounded-lg shadow-sm">
                        <AlertTriangle className="w-5 h-5 mr-3"/>
                        <span className="text-sm">
                            Nenhum desafio sugerido ainda. Por favor, <Link to="/quiz" className="font-semibold underline hover:text-yellow-900">faça o Quiz</Link> para liberar seu Plano de Ação personalizado e ver todos os desafios!
                        </span>
                    </div>
                )}
            </div>
            
            
            {desafioParaSubmeter && (
                <ModalSubmissaoDesafio
                    desafio={desafioParaSubmeter}
                    onClose={() => {
                        setDesafioParaSubmeter(null);
                        setStatusSubmissao('idle'); 
                    }}
                    onSubmit={submeterEvidencia}
                    status={statusSubmissao}
                />
            )}
        </Layout>
    );
}