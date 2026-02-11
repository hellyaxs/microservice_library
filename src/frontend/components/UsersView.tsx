
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

const UsersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
    );
    // In a real app, this would trigger a message to the Users microservice via RabbitMQ/Gateway
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Usuários</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Novo Usuário
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Filtrar por Papel:</span>
          <select 
            className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white text-slate-900"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">Todos</option>
            <option value="Admin">Admin</option>
            <option value="Librarian">Bibliotecário</option>
            <option value="User">Usuário</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Usuário</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Papel / Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Último Acesso</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full bg-slate-100 p-0.5 border border-slate-200" 
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                    className={`text-xs font-bold py-1 px-2 rounded border focus:outline-none transition ${
                      user.role === 'Admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                      user.role === 'Librarian' ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                      'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Librarian">Librarian</option>
                    <option value="User">User</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleStatusToggle(user.id)}
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                  >
                    {user.status}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button title="Editar" className="p-1 text-slate-400 hover:text-indigo-600 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button title="Excluir" className="p-1 text-slate-400 hover:text-rose-600 transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Nenhum usuário encontrado para sua busca ou filtro.
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Dica de Permissões</h4>
            <p className="text-sm text-slate-600 mt-1">
              As alterações de papéis são propagadas de forma assíncrona para todos os microsserviços via RabbitMQ. 
              O serviço de **Users (Spring Boot)** é o responsável pela autoridade central.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
