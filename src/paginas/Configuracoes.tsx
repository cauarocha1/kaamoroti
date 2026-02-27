import { useState } from "react";
import { Settings, User, Lock, Save, Loader2, AlertTriangle, CheckCircle, LogOut } from 'lucide-react'; 
import { useAutenticacao } from "../contextos/AutenticacaoContexto";
import Layout from "../componentes/Layout";

export default function Configuracoes() {
    const { 
        usuarioLogado, 
        atualizarNomeUsuario, 
        atualizarSenhaUsuario, 
        logout
    } = useAutenticacao();
    
    const [novoNome, setNovoNome] = useState(usuarioLogado?.displayName || "");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const FeedbackMessage = ({ tipo, texto }: { tipo: 'sucesso' | 'erro', texto: string }) => (
        <div 
            className={`flex items-center p-3 rounded-md mt-4 text-sm font-medium ${
                tipo === 'erro' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
        >
            {tipo === 'erro' ? <AlertTriangle className="w-5 h-5 mr-2"/> : <CheckCircle className="w-5 h-5 mr-2"/>}
            {texto}
        </div>
    );

    const handleAtualizarNome = async () => {
        if (!novoNome.trim() || novoNome === usuarioLogado?.displayName) {
            setMensagem({ tipo: 'erro', texto: "O nome não pode estar vazio e deve ser diferente do atual." });
            return;
        }
        setLoading(true);
        setMensagem(null);
        try {
            await atualizarNomeUsuario(novoNome);
            setMensagem({ tipo: 'sucesso', texto: "Nome atualizado com sucesso!" });
        } catch (err) {
            console.error(err);
            setMensagem({ tipo: 'erro', texto: "Erro ao atualizar nome. Tente novamente." });
        } finally {
            setLoading(false);
        }
    };

    const handleAtualizarSenha = async () => {
        setMensagem(null);

        if (novaSenha.length < 6) {
            setMensagem({ tipo: 'erro', texto: "A nova senha deve ter no mínimo 6 caracteres." });
            return;
        }
        if (novaSenha !== confirmarNovaSenha) {
            setMensagem({ tipo: 'erro', texto: "As senhas não coincidem." });
            return;
        }

        setLoading(true);
        try {
            await atualizarSenhaUsuario(novaSenha);
            setMensagem({ 
                tipo: 'sucesso', 
                texto: "Senha atualizada com sucesso! Por segurança, você será desconectado e precisará fazer login novamente." 
            });
            setNovaSenha("");
            setConfirmarNovaSenha("");
            
            setTimeout(() => {
                logout();
            }, 3000); 

        } catch (error: any) {
            let msg = "Erro ao atualizar senha.";
            if (error.code === 'auth/requires-recent-login') {
                msg = "Operação recente requer re-autenticação. Por favor, saia e faça login novamente para trocar a senha.";
            } else if (error.code === 'auth/weak-password') {
                msg = "Senha muito fraca, use pelo menos 6 caracteres.";
            }
            setMensagem({ tipo: 'erro', texto: msg });
        } finally {
            setLoading(false);
        }
    };

    if (!usuarioLogado) {
        return (
            <Layout>
                <div className="text-center p-8 text-red-600">
                    Você precisa estar logado para gerenciar suas Configurações.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-6 space-y-8">
                <h1 className="text-3xl font-bold text-green-800 text-center flex items-center justify-center space-x-3">
                    <Settings className="w-8 h-8 text-green-600"/>
                    <span>Configurações da Conta</span>
                </h1>

                
                <section className="p-6 bg-white shadow-xl rounded-lg border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-green-700 border-b pb-2 flex items-center space-x-2">
                        <User className="w-5 h-5"/> <span>Dados Pessoais</span>
                    </h2>
                    <p className="pb-3 text-gray-600"><strong>E-mail:</strong> {usuarioLogado?.email}</p>

                    <div className="space-y-2">
                        <label className="block font-medium text-gray-700" htmlFor="nome">Nome de Exibição</label>
                        <input
                            id="nome"
                            type="text"
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md focus:ring-green-400 focus:border-green-400 transition"
                            disabled={loading}
                        />
                        <button
                            onClick={handleAtualizarNome}
                            className={`mt-2 px-4 py-2 rounded-md transition text-white font-semibold flex items-center space-x-2 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'
                            }`}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            <span>{loading ? 'Atualizando...' : 'Salvar Nome'}</span>
                        </button>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center space-x-2"><Lock className="w-4 h-4"/> <span>Alterar Senha</span></h3>
                        
                        <label className="block font-medium text-gray-700" htmlFor="senha">Nova Senha (Mín. 6 caracteres)</label>
                        <input
                            id="senha"
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md focus:ring-green-400 focus:border-green-400"
                            disabled={loading}
                        />
                        
                        <label className="block font-medium text-gray-700" htmlFor="confirmarSenha">Confirmar Nova Senha</label>
                        <input
                            id="confirmarSenha"
                            type="password"
                            value={confirmarNovaSenha}
                            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md focus:ring-green-400 focus:border-green-400"
                            disabled={loading}
                        />

                        <button
                            onClick={handleAtualizarSenha}
                            className={`mt-2 px-4 py-2 rounded-md transition text-white font-semibold flex items-center space-x-2 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                            }`}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                            <span>{loading ? 'Atualizando...' : 'Mudar Senha'}</span>
                        </button>
                    </div>

                    {mensagem && <FeedbackMessage tipo={mensagem.tipo} texto={mensagem.texto} />}
                </section>

                <section className="p-6 bg-white shadow-xl rounded-lg border border-gray-100 space-y-4">
                    <h2 className="text-xl font-bold text-green-700">Privacidade</h2>
                    <p className="text-gray-600">A sua Pontuação de Ação (PA) e posição no Ranking são dados públicos. Outras informações, como seu histórico detalhado de desafios e as Tags de Baixa Pontuação, são mantidas em sigilo.</p>
                </section>
                
                
                <section className="p-6 bg-white shadow-xl rounded-lg border border-red-100 space-y-4">
                    <h2 className="text-xl font-bold text-red-700 border-b pb-2 flex items-center space-x-2">
                        <LogOut className="w-5 h-5"/> <span>Finalizar Sessão</span>
                    </h2>
                    <p className="text-gray-600">
                        Clique no botão abaixo para encerrar sua sessão atual.
                    </p>
                    <button
                        onClick={logout}
                        className="w-full md:w-auto px-6 py-2 rounded-md transition text-white font-semibold flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        <span>Sair da Conta</span>
                    </button>
                </section>

            </div>
        </Layout>
    );
}