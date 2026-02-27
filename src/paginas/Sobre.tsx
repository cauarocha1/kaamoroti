import Layout from "../componentes/Layout";
import { Link } from "react-router-dom"; 
import { Leaf, Handshake, Globe, ShoppingCart, Home } from 'lucide-react';
import FotoPerfil from "../assets/cauafoto.jpeg";

const odsFoco = [
    {
        numero: 13,
        titulo: "Ação Contra a Mudança Global do Clima",
        icone: Globe,
        cor: "text-green-700",
        descricao: "O quiz mede e incentiva a redução da pegada de carbono, combatendo as emissões ligadas ao transporte e consumo de energia."
    },
    {
        numero: 12,
        titulo: "Consumo e Produção Responsáveis",
        icone: ShoppingCart,
        cor: "text-yellow-600",
        descricao: "Direciona o usuário para práticas de consumo consciente, descarte correto de resíduos e redução do desperdício."
    },
    {
        numero: 11,
        titulo: "Cidades e Comunidades Sustentáveis",
        icone: Home,
        cor: "text-orange-500",
        descricao: "Foca em hábitos domésticos e de mobilidade que contribuem para tornar áreas urbanas mais verdes, eficientes e seguras."
    }
];

export default function Sobre() {
    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-12">
                
                <header className="text-center py-16 bg-white rounded-xl shadow-lg border-b-4 border-green-600">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 tracking-tight">
                        Sobre o Ka'a Morotĩ <Leaf className="inline w-12 h-12 align-middle"/>
                    </h1>
                    <p className="mt-4 text-xl text-gray-700 max-w-4xl mx-auto">
                        Nossa missão é transformar a conscientização ambiental em <span className="font-extrabold">ação diária</span>, fornecendo dados e dicas personalizadas para um futuro mais limpo e sustentável.
                    </p>
                </header>

                <section className="bg-green-50 p-8 rounded-xl shadow-inner space-y-6">
                    <h2 className="text-3xl font-bold text-green-800 text-center">Origem do Nome e Conceito</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="text-center md:text-left space-y-3">
                    <p className="text-5xl font-extrabold text-green-600">
                        Ka'a Morotĩ
                    </p>
                            <p className="text-lg text-gray-700">
                        O nome Ka'a Morotĩ é inspirado na língua <span className="font-extrabold">Tupi-Guarani</span>:
                            </p>
                            <ul className="list-disc list-inside ml-4 text-lg font-semibold text-gray-800 space-y-1">
                                <li>Ka’a: Significa <span className="font-extrabold">Mata</span> ou <span className="font-extrabold">Floresta</span>.</li>
                                <li>Moroti: Significa <span className="font-extrabold">Branco</span> ou <span className="font-extrabold">Limpo</span>.</li>
                            </ul>
                            <p className="pt-2 text-gray-600 italic">
                                Juntos, simbolizam o nosso ideal: um <span className="font-extrabold">Mundo Limpo e Saudável</span>, livre da poluição. O projeto é um guia para que o usuário floresça hábitos sustentáveis.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <Leaf className="w-full h-auto text-green-500 opacity-75"/>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Compromisso Global: Alinhamento aos ODS</h2>
                    <p className="text-center text-lg text-gray-600 max-w-4xl mx-auto">
                        O Ka'a Morotĩ está diretamente alinhado aos <span className="font-extrabold">Objetivos de Desenvolvimento Sustentável (ODS)</span> da ONU, focando em onde a ação individual tem o maior impacto:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 pt-4">
                        {odsFoco.map((ods, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-xl border-t-8 border-gray-300 transition hover:shadow-2xl">
                                <ods.icone className={`w-10 h-10 mb-3 ${ods.cor}`} />
                                <h3 className="text-sm font-bold text-gray-500">ODS {ods.numero}</h3>
                                <h4 className="text-xl font-extrabold text-gray-800">{ods.titulo}</h4>
                                <p className="mt-3 text-gray-600 text-sm">
                                    {ods.descricao}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section className="text-center pt-8 border-t border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Desenvolvimento Tecnológico</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Desenvolvido com <span className="font-extrabold">React e TypeScript</span> para escalabilidade e robustez, e estilizado com <span className="font-extrabold">Tailwind CSS</span> para um design responsivo e moderno. A autenticação e o armazenamento de dados históricos (do quiz) são gerenciados com <span className="font-extrabold">Google Firebase</span> (Authentication e Firestore).
                    </p>
                </section>

        
                 <section className="bg-white p-8 rounded-xl shadow-2xl border-b-4 border-green-600 space-y-6">
                <h2 className="text-3xl font-bold text-green-700 text-center">
                    O Autor e o Projeto Final
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl mx-auto gap-8">

                    
                    <div className="flex-shrink-0">
                        <img 
                            src={FotoPerfil}
                            alt="Foto do Desenvolvedor do TCC, Cauã Souza"
                            className="w-40 h-40 object-cover rounded-full shadow-xl border-4 border-green-500"
                        />
                    </div>

                    
                    <div className="text-center md:text-left space-y-3">
                        <p className="text-lg text-gray-800">
                            O Ka'a Morotĩ é o <strong>Trabalho de Conclusão de Curso (TCC)</strong> desenvolvido pelo aluno:
                        </p>

                        <p className="text-3xl font-extrabold text-gray-900">
                            Cauã Rocha Ribeiro de Souza
                        </p>

                        <p className="text-sm text-gray-600 pt-2">
                           🎓 <strong>Curso:</strong> Técnico em Desenvolvimento de Sistemas (Etec de Hortolândia)
                        </p>
                        <p className="text-sm text-gray-600">
                            💡 <strong>Orientadora:</strong> Prof.ª Priscila Batista Martins 
                        </p>

                        <p className="pt-4 text-gray-700 italic text-sm">
                            O projeto aplica o conhecimento técnico em React, Firebase e a metodologia ágil para criar uma solução funcional, robusta e escalável, focada na gamificação da conscientização ambiental.
                        </p>
                    </div>
                </div>
            </section>

                <div className="text-center pb-8">
                    <Link 
                        to="/contato" 
                        className="inline-flex items-center space-x-2 px-8 py-3 bg-green-700 text-white font-bold rounded-full hover:bg-green-600 transition duration-300 shadow-lg"
                    >
                        <span>Entre em Contato ou Saiba Mais</span>
                        <Handshake className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </Layout>
    );
}