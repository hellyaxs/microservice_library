
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SERVICE_STATUS, MOCK_BOOKS, MOCK_LOANS, MOCK_PAYMENTS } from '../constants';

const data = [
  { name: 'Seg', loans: 4, sales: 2400 },
  { name: 'Ter', loans: 7, sales: 1398 },
  { name: 'Qua', loans: 5, sales: 9800 },
  { name: 'Qui', loans: 12, sales: 3908 },
  { name: 'Sex', loans: 15, sales: 4800 },
  { name: 'Sab', loans: 8, sales: 3800 },
  { name: 'Dom', loans: 3, sales: 4300 },
];

const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Livros em Estoque" value={MOCK_BOOKS.reduce((acc, b) => acc + b.stock, 0)} color="bg-blue-500" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
        <StatCard title="Empréstimos Ativos" value={MOCK_LOANS.filter(l => l.status !== 'Returned').length} color="bg-indigo-500" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <StatCard title="Receita Mensal" value={`R$ ${MOCK_PAYMENTS.reduce((acc, p) => acc + p.amount, 0).toFixed(2)}`} color="bg-emerald-500" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard title="Usuários Ativos" value="242" color="bg-orange-500" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Volume de Empréstimos Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="loans" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Status dos Microsserviços</h3>
          <div className="space-y-4 overflow-y-auto max-h-64">
            {SERVICE_STATUS.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{service.name}</p>
                  <p className="text-xs text-slate-500">{service.technology} • {service.latency}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    service.status === 'Online' ? 'bg-emerald-500' : 
                    service.status === 'Degraded' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-600">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Tendência de Receita</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; color: string; icon: string }> = ({ title, value, color, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default DashboardView;
