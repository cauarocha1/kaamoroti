import { useState } from "react"; 
import Layout from "../componentes/Layout";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'; 

const InfoCard = ({ Icon, title, content }: { Icon: any, title: string, content: string }) => (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 text-center">
        <Icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 break-words mt-1">{content}</p>
    </div>
);

export default function Contato() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [feedback, setFeedback] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);
    const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setFeedback(null);

		setTimeout(() => {
			setLoading(false);
            
			setFeedback({ 
				tipo: 'sucesso', 
				texto: "Mensagem enviada com sucesso! Agradecemos o seu contato." 
			});

			setNome("");
			setEmail("");
			setMensagem("");
            
			setTimeout(() => setFeedback(null), 5000);
            
		}, 1500);
	};

    return (
        <Layout hideNav={true}>
            <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 bg-white rounded-lg shadow-2xl border border-gray-100">
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold text-green-700">Entre em Contato</h1>
                    <p className="text-gray-600 mt-2">
                        Adoramos ouvir sugestões e feedbacks! Use os canais abaixo.
                    </p>
                </header>

                
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <InfoCard Icon={Mail} title="E-mail" content="contato@kaamoroti.com.br" />
                    <InfoCard Icon={Phone} title="Telefone" content="(19) 98765-4321" />
                    <InfoCard Icon={MapPin} title="Local" content="Hortolândia, SP" />
                </section>

                
                <section className="pt-6 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center space-x-2">
                        <Send className="w-6 h-6 text-green-600"/>
                        <span>Envie uma Mensagem</span>
                    </h2>
                    
                    {feedback && (
                        <div 
                            className={`flex items-center p-3 rounded-lg mb-4 font-medium ${
                                feedback.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            <CheckCircle className="w-5 h-5 mr-2"/> {feedback.texto}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <input 
                            type="text" 
                            placeholder="Seu Nome" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition" 
                            required 
                            disabled={loading}
                        />
                        <input 
                            type="email" 
                            placeholder="Seu E-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition" 
                            required 
                            disabled={loading}
                        />
                        <textarea 
                            placeholder="Sua Mensagem ou Sugestão" 
                            rows={5} 
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition" 
                            required 
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2"/> Enviando...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Send className="w-5 h-5 mr-2"/> Enviar Mensagem
                                </span>
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}