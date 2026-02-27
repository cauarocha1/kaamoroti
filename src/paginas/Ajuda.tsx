import Layout from "../componentes/Layout";
import { Link } from "react-router-dom"; 
import { 
    HelpCircle, UserPlus, Target, TrendingUp, Settings, BookOpen
} from 'lucide-react';

export default function Ajuda() {
    const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
        <div className="border-l-4 border-green-500 pl-4 py-2 space-y-2 bg-gray-50 rounded-md">
            <h2 className="text-xl font-bold text-green-700 flex items-center space-x-2">
                <Icon className="w-5 h-5 text-green-600" />
                <span>{title}</span>
            </h2>
            <div className="text-gray-700">
                {children}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-6 space-y-8">
                
                <header className="text-center pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-green-800 flex items-center justify-center space-x-3">
                        <HelpCircle className="w-8 h-8 text-green-600"/>
                        <span>Central de Ajuda Ka'a Morotĩ</span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Seu guia para a jornada de sustentabilidade e gamificação.
                    </p>
                </header>

                <h2 className="text-2xl font-bold text-gray-800 pt-2">O Ciclo de Ação (A alma do Ka'a Morotĩ)</h2>
                
                <div className="space-y-6">
                    <Section title="1. Cadastro e Acesso" icon={UserPlus}>
                        <p>Para iniciar, crie sua conta na página de <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">Cadastro</Link>. Utilize seu email e uma senha segura. Em seguida, acesse sua conta pela página de <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>.</p>
                    </Section>

                    <Section title="2. Diagnóstico: Faça o Quiz!" icon={BookOpen}>
                        <p>O Quiz é o ponto de partida! Ele avalia seus hábitos atuais e identifica as áreas de maior potencial de impacto (suas Tags de Baixa Pontuação). Este diagnóstico é usado para personalizar seus desafios.</p>
                        <p className="text-sm italic mt-1 bg-yellow-100 p-2 rounded">
                            Dica: Você pode refazer o Quiz a qualquer momento para recalibrar seu perfil.
                        </p>
                    </Section>

                    <Section title="3. Ação: Conclua os Desafios" icon={Target}>
                        <p>Na página Desafios, você verá um Plano de Ação Personalizado, baseado nas suas Tags. Para completar um desafio e ganhar <span className="font-bold">Pontos de Ação (PA)</span>, clique em "Concluir" e submeta uma breve evidência da sua ação sustentável.</p>
                        <p>Os <span className="font-bold">Pontos de Ação (PA)</span> são a métrica principal do seu impacto.</p>
                    </Section>

                    <Section title="4. Recompensa: Suba no Ranking!" icon={TrendingUp}>
                        <p>A página <span className="font-bold">Ranking</span> exibe a classificação dos usuários com base nos seus Pontos de Ação (PA). Quanto mais desafios você conclui, maior seu impacto e melhor sua posição na comunidade!</p>
                    </Section>

                    <Section title="5. Seu Perfil e Dados" icon={Settings}>
                        <p>Na página <span className="font-bold">Perfil</span>, você pode visualizar seu progresso total, seu Histórico de Desafios Concluídos e as configurações para alterar seu nome, senha ou e-mail.</p>
                    </Section>
                </div>
                
            </div>
        </Layout>
    );
}