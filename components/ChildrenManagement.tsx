import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Child } from '../types';
import ChildDetails from './ChildDetails';
import ChildForm from './ChildForm';
import { PlusIcon, UserIcon, UserGroupIcon } from './icons/Icons';
import Modal from './Modal';

const ChildrenManagement: React.FC = () => {
    const { state, selectChild } = useAppContext();
    const { children, selectedChildId, healthAgents } = state;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredChildren = useMemo(() => {
        const cleanedSearchTerm = searchTerm.toLowerCase().replace(/[.-]/g, '');
        if (!cleanedSearchTerm) return children;
        return children.filter(child => 
            child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.cpf.replace(/[.-]/g, '').includes(cleanedSearchTerm)
        );
    }, [children, searchTerm]);

    const selectedChild = children.find(c => c.id === selectedChildId);

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Crianças</h2>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Adicionar
                    </button>
                </div>
                 <div className="mt-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                </div>
                <nav className="space-y-1">
                    {filteredChildren.map((child: Child) => (
                        <a
                            key={child.id}
                            href="#"
                            onClick={(e) => { e.preventDefault(); selectChild(child.id); }}
                            className={`${child.id === selectedChildId ? 'bg-gray-200 text-primary-600' : 'text-gray-900 hover:bg-gray-100'} group flex items-center rounded-md px-3 py-2 text-sm font-medium`}
                        >
                            <UserIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-500" />
                            <span className="truncate">{child.name}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
                {selectedChild ? (
                    <ChildDetails child={selectedChild} />
                ) : (
                    <div className="flex items-center justify-center h-full bg-white rounded-lg shadow p-10">
                        <div className="text-center">
                            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma criança selecionada</h3>
                            <p className="mt-1 text-sm text-gray-500">Selecione uma criança da lista à esquerda ou adicione uma nova.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Cadastrar Nova Criança">
                <ChildForm onClose={() => setIsAddModalOpen(false)} healthAgents={healthAgents} />
            </Modal>
        </div>
    );
};

export default ChildrenManagement;