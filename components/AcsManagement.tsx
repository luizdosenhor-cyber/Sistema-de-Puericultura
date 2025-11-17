import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ACS } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon, IdentificationIcon } from './icons/Icons';

const AcsForm: React.FC<{ acs?: ACS; onClose: () => void }> = ({ acs, onClose }) => {
    const { addAcs, updateAcs } = useAppContext();
    const [name, setName] = useState(acs?.name || '');
    const [email, setEmail] = useState(acs?.email || '');
    const [contact, setContact] = useState(acs?.contact || '');
    
    const isEditing = !!acs;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateAcs({ ...acs, name, email, contact });
        } else {
            addAcs({ name, email, contact });
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="acs-name" className="block text-sm font-medium text-gray-700">Nome do Agente</label>
                <input type="text" id="acs-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="acs-email" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input type="email" id="acs-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="acs-contact" className="block text-sm font-medium text-gray-700">Telefone/WhatsApp</label>
                <input type="tel" id="acs-contact" value={contact} onChange={e => setContact(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="(XX) XXXXX-XXXX"/>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700">{isEditing ? 'Atualizar' : 'Salvar'}</button>
            </div>
        </form>
    );
};

const AcsManagement: React.FC = () => {
    const { state, deleteAcs } = useAppContext();
    const { healthAgents } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAcs, setEditingAcs] = useState<ACS | undefined>(undefined);
    const [deletingAcs, setDeletingAcs] = useState<ACS | null>(null);

    const openModalForNew = () => {
        setEditingAcs(undefined);
        setIsModalOpen(true);
    };

    const openModalForEdit = (acs: ACS) => {
        setEditingAcs(acs);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingAcs) {
            deleteAcs(deletingAcs.id);
            setDeletingAcs(null);
        }
    }

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestão de Agentes de Saúde</h2>
                    <p className="mt-1 text-sm text-gray-500">Adicione, edite ou remova agentes do sistema.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                    <button onClick={openModalForNew} className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Adicionar Agente
                    </button>
                </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {healthAgents.map((agent) => (
                        <li key={agent.id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center">
                                    <IdentificationIcon className="h-8 w-8 text-gray-400 mr-4"/>
                                    <div>
                                        <p className="text-sm font-medium text-primary-600 truncate">{agent.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{agent.email}</p>
                                        <p className="text-sm text-gray-500 truncate">{agent.contact}</p>
                                    </div>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex space-x-2">
                                    <button onClick={() => openModalForEdit(agent)} className="p-2 text-gray-400 hover:text-gray-600">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                     <button onClick={() => setDeletingAcs(agent)} className="p-2 text-red-400 hover:text-red-600">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAcs ? 'Editar Agente' : 'Adicionar Novo Agente'}>
                <AcsForm acs={editingAcs} onClose={() => setIsModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={!!deletingAcs} onClose={() => setDeletingAcs(null)} title="Confirmar Exclusão">
                <p>Você tem certeza que deseja excluir o agente de saúde <strong>{deletingAcs?.name}</strong>? Esta ação não pode ser desfeita e o agente será desvinculado de todas as crianças.</p>
                <div className="flex justify-end space-x-2 pt-4 mt-4">
                    <button type="button" onClick={() => setDeletingAcs(null)} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Cancelar</button>
                    <button onClick={handleConfirmDelete} className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700">Excluir</button>
                </div>
            </Modal>

        </div>
    );
};

export default AcsManagement;