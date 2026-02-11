
import React, { useState } from 'react';
import { getAIInsights } from '../geminiService';

const AIInsightsView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const result = await getAIInsights(prompt);
    setResponse(result);
    setIsLoading(false);
  };

  const suggestPrompts = [
    "Como está o desempenho do serviço de Pagamentos?",
    "Quais livros estão com estoque baixo e precisam de reposição?",
    "Sugira 3 novos títulos de tecnologia para adicionar ao catálogo.",
    "Resuma o status geral da infraestrutura de microsserviços."
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative border border-slate-800">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Assistente de IA da Livraria</h2>
          <p className="text-indigo-200">Insights inteligentes sobre seu catálogo, usuários e infraestrutura técnica.</p>
        </div>
        <div className="absolute right-[-20px] top-[-20px] opacity-10 text-white">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pergunte à IA</label>
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400 shadow-sm"
              placeholder="Ex: Qual o livro mais popular do mês?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
            <button
              onClick={handleQuery}
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Pensando...</span>
                </div>
              ) : 'Consultar'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {suggestPrompts.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 font-medium transition"
            >
              {p}
            </button>
          ))}
        </div>

        {response && (
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-indigo-900">Resposta da IA</h4>
                <div className="prose prose-indigo text-indigo-800 leading-relaxed">
                  {response.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!response && !isLoading && (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-medium">Sua consulta aparecerá aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsView;
