import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CalendarDaysIcon } from './icons/Icons';
import { ConsultationStatus } from '../types';

const statusColors: { [key in ConsultationStatus]: string } = {
    [ConsultationStatus.Pendente]: 'bg-yellow-100 text-yellow-800',
    [ConsultationStatus.Realizado]: 'bg-green-100 text-green-800',
    [ConsultationStatus.Criado]: 'bg-blue-100 text-blue-800',
    [ConsultationStatus.Enviado]: 'bg-indigo-100 text-indigo-800',
};

const Agenda: React.FC = () => {
    const { state } = useAppContext();
    const { children, healthAgents } = state;

    const upcomingConsultations = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        return children
            .flatMap(child => child.consultations.map(consultation => ({
                ...consultation,
                childName: child.name,
                childId: child.id,
                acsId: child.acsId,
            })))
            .filter(consultation => new Date(consultation.scheduledDate) >= today)
            .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    }, [children]);
    
    return (
         <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Agenda Consolidada</h2>
                    <p className="mt-1 text-sm text-gray-500">Todas as próximas consultas agendadas no sistema.</p>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {upcomingConsultations.length > 0 ? (
                        upcomingConsultations.map((consult) => {
                            const acs = healthAgents.find(a => a.id === consult.acsId);
                            return (
                                <li key={`${consult.childId}-${consult.id}`}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 text-center bg-primary-100 p-2 rounded-md w-20">
                                                <p className="text-sm font-bold text-primary-700">{new Date(consult.scheduledDate).toLocaleDateString('pt-BR', { day: '2-digit' })}</p>
                                                <p className="text-xs text-primary-600">{new Date(consult.scheduledDate).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                                                <p className="text-xs text-gray-500">{new Date(consult.scheduledDate).toLocaleDateString('pt-BR', { year: 'numeric' })}</p>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-primary-700 truncate">{consult.milestone}</p>
                                                <p className="text-sm text-gray-900">{consult.childName}</p>
                                                <p className="text-xs text-gray-500">Agente: {acs?.name || 'Não vinculado'}</p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:mt-0">
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[consult.status]}`}>
                                                {consult.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-center py-10">
                            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma consulta futura</h3>
                            <p className="mt-1 text-sm text-gray-500">Não há consultas agendadas para os próximos dias.</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Agenda;