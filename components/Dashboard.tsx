import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserGroupIcon, CalendarIcon, IdentificationIcon } from './icons/Icons';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { children, healthAgents } = state;

  const upcomingConsultations = children.flatMap(c => c.consultations)
    .filter(consult => new Date(consult.scheduledDate) >= new Date() && consult.status === 'Pendente')
    .length;

  const stats = [
    { name: 'Crianças Cadastradas', stat: children.length, icon: UserGroupIcon, color: 'bg-primary-500' },
    { name: 'Agentes de Saúde', stat: healthAgents.length, icon: IdentificationIcon, color: 'bg-green-500' },
    { name: 'Consultas Próximas', stat: upcomingConsultations, icon: CalendarIcon, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Visão geral do sistema e atividades recentes.</p>
      </div>
      
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-8 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className={`absolute rounded-md ${item.color} p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline ">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Bem-vindo ao Sistema de Puericultura!</h3>
        <p className="mt-2 text-sm text-gray-600">
            Use as abas de navegação acima para gerenciar crianças, agentes de saúde, visualizar a agenda, gerar relatórios detalhados e consultar os logs de atividade. 
            Este painel oferece uma visão rápida dos principais indicadores do sistema.
        </p>
      </div>

    </div>
  );
};

export default Dashboard;