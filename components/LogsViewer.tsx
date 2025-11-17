import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ClockIcon } from './icons/Icons';

const LogsViewer: React.FC = () => {
    const { state } = useAppContext();
    const { logs } = state;
    
    return (
        <div>
             <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Logs de Atividade</h2>
                    <p className="mt-1 text-sm text-gray-500">Registro de todas as ações importantes no sistema.</p>
                </div>
            </div>
            
            <div className="bg-white shadow rounded-lg">
                <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                    {logs.map((log) => (
                    <li key={log.id} className="p-4 flex items-start space-x-3">
                        <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                        <p className="text-sm text-gray-800">{log.message}</p>
                        <p className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                        </p>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
};

export default LogsViewer;