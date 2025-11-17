import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Child, ACS } from '../types';

interface ChildFormProps {
    child?: Child;
    onClose: () => void;
    healthAgents: ACS[];
}

const ChildForm: React.FC<ChildFormProps> = ({ child, onClose, healthAgents }) => {
    const { addChild, updateChild } = useAppContext();
    const isEditing = !!child;

    const [formData, setFormData] = useState({
        name: child?.name || '',
        dateOfBirth: child?.dateOfBirth || '',
        sex: child?.sex || '',
        cpf: child?.cpf || '',
        motherName: child?.motherName || '',
        fatherName: child?.fatherName || '',
        contact: child?.contact || '',
        nationality: child?.nationality || 'Brasileira',
        placeOfBirth: child?.placeOfBirth || '',
        familyHistory: child?.familyHistory || '',
        acsId: child?.acsId || '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.sex) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (isEditing && child) {
            updateChild({ 
                ...child, 
                ...formData, 
                sex: formData.sex as 'Masculino' | 'Feminino',
                acsId: formData.acsId || undefined 
            });
        } else {
             const { sex, ...rest } = formData;
            const childData = { ...rest, sex: sex as 'Masculino' | 'Feminino' };
            addChild(childData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="text-md font-medium text-gray-800 border-b pb-2">Informações Pessoais</h4>
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Criança</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sexo</label>
                    <select id="sex" value={formData.sex} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="" disabled>Selecione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
                    <input type="text" id="cpf" value={formData.cpf} onChange={handleChange} required pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" placeholder="000.000.000-00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nacionalidade</label>
                    <input type="text" id="nationality" value={formData.nationality} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                 <div className="sm:col-span-2">
                    <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">Naturalidade (Cidade - UF)</label>
                    <input type="text" id="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
            </div>
            
            <h4 className="text-md font-medium text-gray-800 border-b pb-2 pt-4">Informações Familiares e de Contato</h4>
             <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">Nome da Mãe</label>
                    <input type="text" id="motherName" value={formData.motherName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">Nome do Pai</label>
                    <input type="text" id="fatherName" value={formData.fatherName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Telefone/WhatsApp do Responsável</label>
                    <input type="tel" id="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="(XX) XXXXX-XXXX" />
                </div>
                <div>
                    <label htmlFor="acsId" className="block text-sm font-medium text-gray-700">Agente de Saúde</label>
                    <select id="acsId" value={formData.acsId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option value="">Nenhum</option>
                        {healthAgents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700">Histórico Familiar de Doenças (opcional)</label>
                    <textarea id="familyHistory" rows={3} value={formData.familyHistory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"></textarea>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Cancelar</button>
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    {isEditing ? 'Atualizar Cadastro' : 'Salvar Cadastro'}
                </button>
            </div>
        </form>
    );
};

export default ChildForm;
