import React, { useState, ChangeEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import { AppState } from '../types';
import Modal from './Modal';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, TrashIcon } from './icons/Icons';

const Settings: React.FC = () => {
    const { state, importState, resetState } = useAppContext();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handleExport = () => {
        const dataStr = JSON.stringify(state, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `puericultura_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const newState = JSON.parse(text) as AppState;
                importState(newState);
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                alert("Erro ao ler o arquivo. Certifique-se de que é um arquivo de backup válido.");
            }
        };
        reader.readAsText(file);
    };
    
    const handleConfirmReset = () => {
        resetState();
        setIsResetModalOpen(false);
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Dados do Sistema</h2>
                <p className="mt-1 text-sm text-gray-500">Exporte, importe ou formate o banco de dados da aplicação.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Export Card */}
                <div className="bg-white shadow rounded-lg p-6 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900">Exportar Banco de Dados</h3>
                    <p className="mt-2 text-sm text-gray-600 flex-grow">
                        Crie um backup completo de todos os dados do sistema (crianças, agentes, consultas e logs) em um único arquivo JSON. Guarde este arquivo em um local seguro.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={handleExport}
                            className="w-full inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            Exportar Dados (.json)
                        </button>
                    </div>
                </div>

                {/* Import Card */}
                <div className="bg-white shadow rounded-lg p-6 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900">Importar Banco de Dados</h3>
                    <p className="mt-2 text-sm text-gray-600 flex-grow">
                       Substitua todos os dados atuais do sistema importando um arquivo de backup. <strong className="text-red-600">Atenção: esta ação é irreversível e todos os dados existentes serão perdidos.</strong>
                    </p>
                    <div className="mt-6">
                         <label
                            htmlFor="file-upload"
                            className="w-full cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                            Selecionar Arquivo para Importar
                        </label>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".json,application/json"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>

             {/* Reset Card */}
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <h3 className="text-lg font-medium text-yellow-800">Formatar Banco de Dados</h3>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                         <p className="text-sm text-yellow-700">
                           Apague permanentemente todos os dados do sistema. Use esta opção com extrema cautela para começar do zero ou antes de importar um novo backup. 
                           <strong className="font-semibold">Esta ação não pode ser desfeita.</strong>
                        </p>
                        <p className="mt-3 text-sm md:ml-6 md:mt-0">
                             <button
                                onClick={() => setIsResetModalOpen(true)}
                                className="whitespace-nowrap inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Formatar Sistema
                            </button>
                        </p>
                    </div>
                </div>
            </div>


            <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Confirmar Formatação do Sistema">
                <div>
                    <p className="text-sm text-gray-600">
                        Você tem certeza absoluta que deseja formatar o banco de dados?
                    </p>
                     <p className="mt-2 text-sm text-red-600 font-semibold">
                        Todos os cadastros de crianças, agentes, consultas e logs serão permanentemente apagados. Esta ação não pode ser desfeita.
                    </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsResetModalOpen(false)}
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmReset}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Sim, formatar tudo
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Settings;
