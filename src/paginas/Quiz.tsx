import { useState, useEffect, useMemo } from "react";
import Layout from "../componentes/Layout"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../servicos/firebase";
import { useAutenticacao } from "../contextos/AutenticacaoContexto"; 
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logokaamorotipreta.svg'; 

interface Opcao {
  texto: string;
  pontos: number;
  tags: string[];
}

interface Questao {
  pergunta: string;
  opcoes: Opcao[];
}

interface QuizHistorico {
  pontuacao: number;
  percentual: number;
  tagsBaixaPontuacao: string[];
  respostas: number[];
  timestamp: any;
}

const sugestoesMapeadas: { [tag: string]: string } = {
    emissao_co2: "Priorize o transporte público, caronas ou use bicicleta para reduzir drasticamente sua pegada de carbono.",
    combustivel_fosseil: "Planeje a transição para um veículo elétrico ou híbrido no futuro.",
    alto_plastico: "Adote uma garrafa de água e sacolas reutilizáveis. O plástico de uso único polui oceanos e solos.",
    alto_carbono: "Considere ter um 'Dia Sem Carne' por semana. A pecuária é uma grande fonte de gases-estufa.",
    desperdicio_agua: "Instale aeradores nas torneiras e reduza o tempo do banho. Cada minuto conta!",
    alto_energia: "Troque todas as lâmpadas por LED. Isso economiza energia e dinheiro imediatamente.",
    lixo_misturado: "Comece separando o lixo seco (reciclável) do orgânico. Isso otimiza a reciclagem.",
    lixo_comum_eletronico: "Nunca descarte lixo eletrônico no lixo comum. Procure um ecoponto!",
    descarte_oleo_incorreto: "Não jogue óleo de cozinha na pia. Guarde em garrafas e entregue em pontos de coleta.",
    nao_checa_origem: "Priorize o consumo de alimentos locais e sazonais para reduzir as emissões de transporte.",
    uso_excessivo_agua: "Comece a reaproveitar a água. Água da máquina de lavar ou do banho pode ser usada para lavar pisos.",
    consumo_fantasma: "Desligue aparelhos em stand-by e tire carregadores e TVs da tomada. O 'consumo fantasma' desperdiça energia.",
    fast_fashion: "Evite 'fast fashion'. Priorize brechós ou invista em peças duráveis e de marcas éticas.",
    madeira_nao_certificada: "Ao comprar móveis ou papel, procure sempre pelo selo FSC (manejo florestal responsável).",
    quimicos_forte: "Substitua produtos de limpeza químicos agressivos por alternativas naturais (vinagre, bicarbonato).",
    alto_climatizacao: "Priorize a ventilação cruzada e luz natural. Use o ar-condicionado apenas quando for realmente necessário."
};

const questoes: Questao[] = [
    {
        pergunta: "1. Em relação à mobilidade diária, qual é o seu principal meio de transporte?",
        opcoes: [
            { texto: "Carro particular, moto grande ou táxi/app individual (sozinho/maioria das vezes)", pontos: 0, tags: ["emissao_co2", "combustivel_fosseil"] },
            { texto: "Transporte público (ônibus/metrô) ou carona compartilhada", pontos: 5, tags: ["emissao_co2"] },
            { texto: "Veículo elétrico, híbrido ou moto elétrica/pequena", pontos: 10, tags: [] },
            { texto: "Bicicleta, patinete ou caminhada (quase sempre)", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "2. Qual é a sua atitude em relação ao consumo de plástico de uso único?",
        opcoes: [
            { texto: "Uso itens descartáveis (copos, talheres) e não me preocupo com sacolas", pontos: 0, tags: ["alto_plastico", "descartavel"] },
            { texto: "Às vezes recuso plástico, mas não é um hábito constante. Uso sacolas plásticas.", pontos: 5, tags: ["alto_plastico"] },
            { texto: "Sempre uso garrafa reutilizável e ecobag, evitando canudos", pontos: 10, tags: [] },
            { texto: "Uso 100% reutilizável, compro a granel e evito ao máximo embalagens", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "3. Com que frequência você consome carne vermelha (boi, porco)?",
        opcoes: [
            { texto: "Todos os dias (em mais de uma refeição)", pontos: 0, tags: ["alto_carbono", "carne_vermelha"] },
            { texto: "Algumas vezes por semana (2-4 vezes)", pontos: 5, tags: ["alto_carbono"] },
            { texto: "Raramente (1 vez por semana ou menos)", pontos: 10, tags: [] },
            { texto: "Minha dieta é vegetariana ou vegana", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "4. Você costuma fechar a torneira ao escovar os dentes ou ensaboar louças?",
        opcoes: [
            { texto: "Não me preocupo muito com isso e tomo banhos longos", pontos: 0, tags: ["desperdicio_agua", "uso_excessivo_agua"] },
            { texto: "Às vezes fecho a torneira, mas meus banhos são longos", pontos: 5, tags: ["desperdicio_agua"] },
            { texto: "Sempre fecho a torneira e busco reduzir o tempo de banho (5-8 min)", pontos: 10, tags: [] },
            { texto: "Sempre fecho e reaproveito água (da chuva, da máquina)", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "5. Em relação à eficiência energética, qual é o tipo de lâmpada predominante na sua casa?",
        opcoes: [
            { texto: "Lâmpadas incandescentes/fluorescentes antigas", pontos: 0, tags: ["alto_energia", "energia_fossil"] },
            { texto: "Mistura de lâmpadas antigas e LED", pontos: 5, tags: ["alto_energia"] },
            { texto: "Quase todas as lâmpadas são LED", pontos: 10, tags: [] },
            { texto: "Todas são LED e minha casa tem sistemas de energia solar/limpa", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "6. Qual a sua atitude em relação à separação e descarte de lixo?",
        opcoes: [
            { texto: "Não separo nada, coloco todo o lixo junto", pontos: 0, tags: ["lixo_misturado", "alto_metano"] },
            { texto: "Separo o lixo seco (reciclável), mas misturo o rejeito e orgânico", pontos: 5, tags: ["lixo_misturado"] },
            { texto: "Separo o lixo seco, molhado e rejeitos. Entrego à coleta seletiva.", pontos: 10, tags: [] },
            { texto: "Separo tudo e faço compostagem doméstica do lixo orgânico", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "7. O que você faz com lixo eletrônico (pilhas, baterias, celulares antigos)?",
        opcoes: [
            { texto: "Descarto no lixo comum ou descarto de forma irregular na rua", pontos: 0, tags: ["lixo_comum_eletronico", "contaminacao_solo"] },
            { texto: "Guardo em casa, acumulando lixo eletrônico", pontos: 5, tags: ["lixo_comum_eletronico"] },
            { texto: "Levo a pontos de coleta específicos (ecopontos, lojas, mercados)", pontos: 10, tags: [] },
            { texto: "Além de levar a ecopontos, incentivo amigos e família a fazer o mesmo", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "8. Como você descarta óleo de cozinha usado?",
        opcoes: [
            { texto: "Na pia ou no vaso sanitário", pontos: 0, tags: ["descarte_oleo_incorreto", "poluicao_hidrica"] },
            { texto: "No lixo comum, embalado em plástico", pontos: 5, tags: ["descarte_oleo_incorreto"] },
            { texto: "Armazeno em garrafa, mas não levo para reciclagem", pontos: 10, tags: [] },
            { texto: "Armazeno em garrafa e levo a um ponto de coleta (reciclagem)", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "9. Em relação ao consumo de alimentos, você se preocupa com a origem?",
        opcoes: [
            { texto: "Não. Compro o que for mais barato, sem checar a origem ou agrotóxicos", pontos: 0, tags: ["nao_checa_origem", "transporte_alimentos"] },
            { texto: "Compro orgânicos (sem agrotóxicos) quando disponíveis", pontos: 5, tags: ["nao_checa_origem"] },
            { texto: "Priorizo produtores locais e alimentos da estação (sazonais)", pontos: 10, tags: [] },
            { texto: "Compro local/sazonal e faço parte de grupos de consumo consciente (CSA)", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "10. Você tem o hábito de reaproveitar água em casa (ex: lavar quintal)?",
        opcoes: [
            { texto: "Não, uso água potável para todas as atividades", pontos: 0, tags: ["nao_reutiliza_agua", "uso_excessivo_agua"] },
            { texto: "Às vezes, uso água de balde ou da máquina de lavar para lavar o quintal", pontos: 5, tags: ["nao_reutiliza_agua"] },
            { texto: "Sempre reutilizo água e uso dispositivos de baixo fluxo (vasos/torneiras)", pontos: 10, tags: [] },
            { texto: "Possuo cisterna ou sistema de captação de água da chuva", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "11. Você tem o hábito de tirar carregadores e eletrodomésticos da tomada (stand-by)?",
        opcoes: [
            { texto: "Nunca ou quase nunca (deixo tudo na tomada, ligado ou em stand-by)", pontos: 0, tags: ["consumo_fantasma", "standby_energia"] },
            { texto: "Às vezes, tiro os carregadores de celular e micro-ondas", pontos: 5, tags: ["consumo_fantasma"] },
            { texto: "Uso régua de energia para desligar conjuntos de aparelhos (TV, computador)", pontos: 10, tags: [] },
            { texto: "Sempre tiro carregadores e desligo/tiro da tomada aparelhos não essenciais", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "12. Qual a sua atitude principal na hora de comprar roupas?",
        opcoes: [
            { texto: "Compro 'fast fashion' (moda rápida) com frequência, por ser mais barato", pontos: 0, tags: ["fast_fashion", "consumo_textil"] },
            { texto: "Compro em lojas de departamento, visando preço e tendência", pontos: 5, tags: ["fast_fashion"] },
            { texto: "Compro menos e escolho marcas que parecem ter qualidade e durabilidade", pontos: 10, tags: [] },
            { texto: "Priorizo brechós/roupas de segunda mão ou marcas éticas e sustentáveis", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "13. Ao comprar produtos de papel ou madeira, você verifica a certificação de origem?",
        opcoes: [
            { texto: "Nunca ou raramente, não sei o que são essas certificações", pontos: 0, tags: ["madeira_nao_certificada", "desmatamento"] },
            { texto: "Compro papel reciclado quando lembro", pontos: 5, tags: ["madeira_nao_certificada"] },
            { texto: "Busco o selo FSC (manejo florestal responsável) ou compro papel reciclado sempre", pontos: 10, tags: [] },
            { texto: "Sempre verifico a origem sustentável de móveis e papel (selo FSC/legal)", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "14. Que tipo de produtos você usa na limpeza da casa?",
        opcoes: [
            { texto: "Produtos de limpeza industrial forte, desinfetantes com cheiro muito intenso", pontos: 0, tags: ["quimicos_forte", "poluicao_agua_quimica"] },
            { texto: "Produtos menos agressivos, mas ainda industriais", pontos: 5, tags: ["quimicos_forte"] },
            { texto: "Uso em menor quantidade e busco produtos biodegradáveis", pontos: 10, tags: [] },
            { texto: "Uso produtos caseiros ou naturais (vinagre, bicarbonato) para a maior parte da limpeza", pontos: 15, tags: [] }
        ],
    },
    {
        pergunta: "15. Como você usa a iluminação e ventilação em casa?",
        opcoes: [
            { texto: "Deixo luzes acesas, uso ar-condicionado/aquecedor o dia todo", pontos: 0, tags: ["alto_climatizacao", "iluminacao_ineficiente"] },
            { texto: "Uso luz natural, mas ligo o ar-condicionado em dias quentes", pontos: 5, tags: ["alto_climatizacao"] },
            { texto: "Priorizo ventilação cruzada e só uso A/C ou luz quando estritamente necessário", pontos: 10, tags: [] },
            { texto: "Utilizo ventilação natural e dispositivos inteligentes para otimizar o uso de luz e energia", pontos: 15, tags: [] }
        ],
    }
];

const MAX_SUGGESTIONS = 4;

export default function Quiz() {
  const { usuarioLogado } = useAutenticacao();
  const navigate = useNavigate();
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<{ pontos: number; tags: string[] }[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [selecionada, setSelecionada] = useState<Opcao | null>(null);

  
  const pontuacaoMax = useMemo(() => questoes.length * 15, []);

  
  const pontuacaoTotal = respostas.reduce((acc, cur) => acc + cur.pontos, 0);
  const percentualTotal = pontuacaoMax > 0 ? Math.round((pontuacaoTotal / pontuacaoMax) * 100) : 0;
  
  
  const tagsBaixaPontuacao = useMemo(() => {
    const tagsRuins: string[] = [];
    respostas.forEach(resp => {
      
      if (resp.pontos <= 5) {
        tagsRuins.push(...resp.tags);
      }
    });
    
    
    let tagsUnicas = Array.from(new Set(tagsRuins.filter(tag => sugestoesMapeadas[tag])));
    
    
    return tagsUnicas.slice(0, MAX_SUGGESTIONS);
  }, [respostas]);

  
  const sugestoesFinais = useMemo(() => {
      return tagsBaixaPontuacao.map(tag => sugestoesMapeadas[tag]);
  }, [tagsBaixaPontuacao]);

  const handleSelecionar = (opcao: Opcao) => {
    setSelecionada(opcao);
  };

  const handleProxima = () => {
  if (selecionada !== null) {
    
    setRespostas(prevRespostas => [
      ...prevRespostas, 
      { pontos: selecionada.pontos, tags: selecionada.tags }
    ]);
      
      setSelecionada(null);

      if (indiceAtual + 1 < questoes.length) {
        setIndiceAtual(indiceAtual + 1);
      } else {
        setFinalizado(true);
      }
    }
  };

  
  useEffect(() => {
    
    if (finalizado && usuarioLogado) {
      const salvarResultado = async () => {
        if (!usuarioLogado.uid) return;
        
        try {
          
          const quizCollection = collection(db, "usuarios", usuarioLogado.uid, "historico_quiz"); 
          
          const dados: QuizHistorico = {
              pontuacao: pontuacaoTotal,
              percentual: percentualTotal,
              tagsBaixaPontuacao: tagsBaixaPontuacao,
              respostas: respostas.map(r => r.pontos), 
              timestamp: serverTimestamp()
          }
          
          await addDoc(quizCollection, dados);
          console.log("Resultado salvo com sucesso!");
        } catch (err) {
          console.error("Erro ao salvar resultado:", err);
        }
      };
      
      salvarResultado();
    }
    
  }, [finalizado, usuarioLogado, pontuacaoTotal, percentualTotal, tagsBaixaPontuacao, respostas]);

  const handleRefazer = () => {
    setIndiceAtual(0);
    setRespostas([]);
    setFinalizado(false);
    setSelecionada(null);
  }

  const getFeedbackTexto = () => {
    if (percentualTotal <= 30) return "Sua jornada está apenas começando. Sua pegada de carbono é alta! Priorize as dicas de melhoria.";
    if (percentualTotal <= 60) return "Parabéns pelo esforço! Você está no caminho certo. Pequenas mudanças em seus hábitos farão grande diferença.";
  if (percentualTotal <= 90) return "Excelente! Você é um Defensor Ka'a Morotĩ. Sua conscientização é alta e seu impacto, moderado.";
    return "Nota máxima! Você é um exemplo de sustentabilidade e tem um impacto ambiental baixíssimo. Continue inspirando!";
  };
  
  
  if (!usuarioLogado) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-600">
          Você precisa estar logado para fazer o Quiz Ka'a Morotĩ!
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-8 space-y-6">
    <h1 className="flex items-center space-x-3 text-3xl font-bold text-green-800">
      <img 
        src={Logo} 
        alt="Logo Ka'a Morotĩ" 
        className="h-8 w-auto" 
      />
      <span>Quiz Ka'a Morotĩ</span>
    </h1>

        {!finalizado ? (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${((indiceAtual + 1) / questoes.length) * 100}%` }}
                ></div>
            </div>
            <p className="text-green-700 font-semibold mb-2">
              Pergunta {indiceAtual + 1} de {questoes.length}
            </p>
            <div className="p-4 border rounded-lg bg-white shadow-md space-y-4">
              <p className="font-semibold text-xl text-green-900">{questoes[indiceAtual].pergunta}</p>
              <div className="space-y-2">
                {questoes[indiceAtual].opcoes.map((opcao, i) => {
                    const isSelected = selecionada?.texto === opcao.texto;
                    
    
                    const selectedClass = isSelected 
                        ? "bg-green-600 text-white shadow-lg border-green-700" 
                        : "bg-gray-50 text-green-900 hover:bg-green-100 border-green-300";

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelecionar(opcao)}
                        className={`block w-full text-left px-4 py-3 border rounded-md transition duration-200 
                          ${selectedClass}`}
                      >
                        {opcao.texto}
                      </button>
                    );
                })}
              </div>

              <button
                onClick={handleProxima}
                disabled={selecionada === null}
                className={`w-full mt-4 py-3 px-4 font-bold rounded-md transition duration-200 ${
                  selecionada !== null
                    ? "bg-green-700 text-white hover:bg-green-600 shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {indiceAtual + 1 === questoes.length ? "Finalizar Quiz" : "Próxima"}
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 border rounded-lg bg-white shadow-xl space-y-6">
            <h2 className="text-3xl font-bold text-center text-green-800">Resultado do Quiz! 🎉</h2>
            
            
            <div className="text-center border-b pb-6">
                <p className="text-lg text-gray-600 mb-4">Seu Nível de Conscientização é:</p>
                <div className="relative w-40 h-40 mx-auto mb-4">
            
                    <div className="w-full h-full rounded-full border-8 border-gray-200 absolute"></div>
            
                    <div 
                        className="flex items-center justify-center w-full h-full rounded-full"
                        style={{ 
    
                            background: `radial-gradient(closest-side, white 80%, transparent 81%), conic-gradient(rgb(5, 150, 105) ${percentualTotal}%, rgb(209, 213, 219) 0)`
                        }}
                    >
                        <p className="text-5xl font-extrabold text-green-700">
                            {percentualTotal}%
                        </p>
                    </div>
                </div>
                <p className="text-xl font-semibold text-gray-700">
                    ({pontuacaoTotal} de {pontuacaoMax} pontos)
                </p>
            </div>
            
            <p className="text-xl font-semibold text-center text-green-700">{getFeedbackTexto()}</p>

            <h3 className="font-bold text-lg mt-4 text-green-800">Seus Pontos de Foco (Ações Imediatas):</h3>
            
            {sugestoesFinais.length > 0 ? (
                <ul className="list-disc list-inside space-y-3 ml-4 text-gray-700">
                    {sugestoesFinais.map((sugestao, index) => (
                        <li key={index} className="text-sm font-medium">
                            {sugestao}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-green-600 font-medium">Você obteve nota máxima! Continue assim.</p>
            )}

            
            <button
              onClick={() => navigate('/desafios')}
              className="w-full mt-6 py-3 px-4 bg-green-700 text-white rounded-md font-bold hover:bg-green-600 transition shadow-lg"
            >
              Ver Desafios Sugeridos (Plano de Ação)
            </button>
            <button
              onClick={handleRefazer}
              className="w-full mt-2 py-3 px-4 border border-green-700 text-green-700 rounded-md font-bold hover:bg-green-50 transition"
            >
              Refazer Quiz
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}