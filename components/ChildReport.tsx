import React from 'react';
import { Child } from '../types';
import { useAppContext } from '../context/AppContext';
import { HeartIcon } from './icons/Icons';

interface ChildReportProps {
    child: Child;
}

const ChildReport: React.FC<ChildReportProps> = ({ child }) => {
    const { state } = useAppContext();
    const acs = state.healthAgents.find(a => a.id === child.acsId);
    
    return (
        <div className="p-8 font-sans text-gray-800 bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <header className="flex items-start justify-between pb-4 border-b-2 border-gray-200">
                <div className="flex items-center">
                    <HeartIcon className="h-10 w-10 text-primary-600" />
                    <div className="ml-3">
                        <h1 className="text-2xl font-bold leading-tight">Relatório de Puericultura</h1>
                        <p className="text-md text-gray-600">Acompanhamento de Desenvolvimento Infantil</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">Sistema de Puericultura</p>
                    <p className="text-xs text-gray-500">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
            </header>

            <section className="mt-6">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Dados da Criança</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div><strong className="font-medium text-gray-600">Nome Completo:</strong> {child.name}</div>
                        <div><strong className="font-medium text-gray-600">CPF:</strong> {child.cpf}</div>
                        <div><strong className="font-medium text-gray-600">Data de Nasc.:</strong> {new Date(child.dateOfBirth).toLocaleDateString('pt-BR')}</div>
                        <div><strong className="font-medium text-gray-600">Responsável (Mãe):</strong> {child.motherName}</div>
                        <div><strong className="font-medium text-gray-600">ACS Responsável:</strong> {acs?.name || 'Não vinculado'}</div>
                        <div><strong className="font-medium text-gray-600">Contato do ACS:</strong> {acs?.contact || 'N/A'}</div>
                    </div>
                </div>
            </section>
            
            <section className="mt-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Histórico de Consultas</h2>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 font-semibold text-gray-700 border-b">Marco</th>
                                <th className="p-3 font-semibold text-gray-700 border-b">Data Prevista</th>
                                <th className="p-3 font-semibold text-gray-700 border-b">Data Realizada</th>
                                <th className="p-3 font-semibold text-gray-700 border-b">Peso (kg)</th>
                                <th className="p-3 font-semibold text-gray-700 border-b">Comp. (cm)</th>
                                <th className="p-3 font-semibold text-gray-700 border-b">PC (cm)</th>
                                <th className="p-3 font-semibold text-gray-700 border-b">IMC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {child.consultations.map(c => (
                                <tr key={c.id}>
                                    <td className="p-3">{c.milestone}</td>
                                    <td className="p-3">{new Date(c.scheduledDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="p-3">{c.performedDate ? new Date(c.performedDate).toLocaleDateString('pt-BR') : ' - '}</td>
                                    <td className="p-3">{c.weight || ' - '}</td>
                                    <td className="p-3">{c.length || ' - '}</td>
                                    <td className="p-3">{c.headCircumference || ' - '}</td>
                                    <td className="p-3">{c.bmi || ' - '}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="mt-4">
                    {child.consultations.filter(c => c.observations).map(c => (
                        <div key={`obs-${c.id}`} className="text-xs text-gray-600 mb-2">
                            <strong className="font-medium">Observações ({c.milestone}):</strong> {c.observations}
                        </div>
                    ))}
                </div>
            </section>
             <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
                Relatório gerado pelo Sistema de Puericultura.
            </footer>
        </div>
    );
};

export default ChildReport;
