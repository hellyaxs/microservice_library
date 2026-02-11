
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import BooksView from './components/BooksView';
import UsersView from './components/UsersView';
import AIInsightsView from './components/AIInsightsView';
import { ViewType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'books':
        return <BooksView />;
      case 'users':
        return <UsersView />;
      case 'ai-insights':
        return <AIInsightsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 italic">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>A visão "{currentView}" está em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">
              {currentView.replace('-', ' ')}
            </h1>
            <p className="text-slate-500 mt-1">Bem-vindo ao centro de operações da Livraria Digital.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin Master</p>
                <p className="text-xs text-slate-500">Superusuário</p>
              </div>
              <img src="https://picsum.photos/seed/user12/100/100" className="w-10 h-10 rounded-full border-2 border-indigo-100" alt="Avatar" />
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
};

export default App;
