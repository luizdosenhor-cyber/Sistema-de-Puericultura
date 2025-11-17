import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Child, Consultation, ConsultationStatus } from '../types';
import { useAppContext } from '../context/AppContext';
import { generateReminder } from '../services/geminiService';
import Modal from './Modal';
import ChildForm from './ChildForm';
import ChildReport from './ChildReport';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CalendarDaysIcon, PencilIcon, PaperAirplaneIcon, EnvelopeIcon, ChatBubbleBottomCenterTextIcon, ClipboardDocumentIcon, CheckIcon, TrashIcon, ArrowDownTrayIcon } from './icons/Icons';

const ConsultationForm: React.FC<{ childId: string, consultation: Consultation, onClose: () => void }> = ({ childId, consultation, onClose }) => {
    const { updateConsultation } = useAppContext();
    const [performedDate, setPerformedDate] = useState(consultation.performedDate || new Date().toISOString().split('T')[0]);
    const [weight, setWeight] = useState(consultation.weight || '');
    const [length, setLength] = useState(consultation.length || '');
    const [headCircumference, setHeadCircumference] = useState(consultation.headCircumference || '');
    const [observations, setObservations] = useState(consultation.observations || '');

    const calculateBMI = (w: number, l: number): number | undefined => {
        if (w > 0 && l > 0) {
            const lengthInMeters = l / 100;
            return parseFloat((w / (lengthInMeters * lengthInMeters)).toFixed(2));
        }
        return undefined;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numWeight = parseFloat(weight.toString());
        const numLength = parseFloat(length.toString());
        const bmi = calculateBMI(numWeight, numLength);

        updateConsultation(childId, {
            ...consultation,
            performedDate,
            weight: numWeight,
            length: numLength,
            headCircumference: parseFloat(headCircumference.toString()),
            observations,
            bmi,
            status: ConsultationStatus.Realizado,
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="performedDate" className="block text-sm font-medium text-gray-700">Data da Realização</label>
                <input type="date" id="performedDate" value={performedDate} onChange={e => setPerformedDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                <input type="number" step="0.01" id="weight" value={weight} onChange={e => setWeight(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700">Comprimento (cm)</label>
                <input type="number" step="0.1" id="length" value={length} onChange={e => setLength(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="head" className="block text-sm font-medium text-gray-700">Perímetro Cefálico (cm)</label>
                <input type="number" step="0.1" id="head" value={headCircumference} onChange={e => setHeadCircumference(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700">Observações Clínicas</label>
                <textarea id="observations" rows={4} value={observations} onChange={e => setObservations(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Cancelar</button>
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Salvar Consulta</button>
            </div>
        </form>
    );
};

const ReminderModal: React.FC<{ child: Child, consultation: Consultation, onClose: () => void }> = ({ child, consultation, onClose }) => {
    const { updateConsultation } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [reminder, setReminder] = useState<{ whatsapp: string, emailSubject: string, emailBody: string } | null>(consultation.reminder || null);
    const [copiedWpp, setCopiedWpp] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    React.useEffect(() => {
        if (!consultation.reminder) {
            const fetchReminder = async () => {
                setIsLoading(true);
                const generated = await generateReminder(child.name, child.motherName, new Date(consultation.scheduledDate).toLocaleDateString('pt-BR'));
                setReminder(generated);
                if(generated){
                    updateConsultation(child.id, {...consultation, reminder: generated, status: ConsultationStatus.Criado});
                }
                setIsLoading(false);
            };
            fetchReminder();
        } else {
             setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [child.id, consultation.id]);

    const handleCopy = (text: string, type: 'wpp' | 'email') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'wpp') {
                setCopiedWpp(true);
                setTimeout(() => setCopiedWpp(false), 2000);
            } else {
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
            }
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Não foi possível copiar o texto.');
        });
    };
    
    const handleSend = () => {
        updateConsultation(child.id, {...consultation, status: ConsultationStatus.Enviado});
        alert('Lembretes enviados (simulação).');
        onClose();
    }

    return (
        <div>
            {isLoading ? <p>Gerando lembretes com IA...</p> : 
            reminder ? (
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-800 flex items-center"><ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-green-500" /> WhatsApp</h4>
                            <button
                                type="button"
                                onClick={() => handleCopy(reminder.whatsapp, 'wpp')}
                                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={copiedWpp}
                            >
                                {copiedWpp ? (
                                    <>
                                        <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                                        Copiar
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-gray-700">{reminder.whatsapp}</p>
                    </div>
                     <div>
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-800 flex items-center"><EnvelopeIcon className="h-5 w-5 mr-2 text-blue-500" /> E-mail</h4>
                             <button
                                type="button"
                                onClick={() => handleCopy(reminder.emailBody, 'email')}
                                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={copiedEmail}
                            >
                                {copiedEmail ? (
                                    <>
                                        <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                                        Copiar Texto
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-gray-700 space-y-2">
                           <p><span className="font-semibold">Assunto:</span> {reminder.emailSubject}</p>
                           <p className="whitespace-pre-wrap">{reminder.emailBody}</p>
                        </div>
                    </div>
                     <div className="flex justify-end pt-4">
                        <button onClick={handleSend} className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                           <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                            Simular Envio
                        </button>
                    </div>
                </div>
            ) : <p>Não foi possível gerar os lembretes.</p>}
        </div>
    );
}

const statusColors: { [key in ConsultationStatus]: string } = {
    [ConsultationStatus.Pendente]: 'bg-yellow-100 text-yellow-800',
    [ConsultationStatus.Realizado]: 'bg-green-100 text-green-800',
    [ConsultationStatus.Criado]: 'bg-blue-100 text-blue-800',
    [ConsultationStatus.Enviado]: 'bg-indigo-100 text-indigo-800',
};


const ChildDetails: React.FC<{ child: Child }> = ({ child }) => {
    const { state, deleteChild } = useAppContext();
    const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
    const [reminderConsultation, setReminderConsultation] = useState<Consultation | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const assignedAcs = state.healthAgents.find(a => a.id === child.acsId);
    
    const isPuericultureComplete = child.consultations.every(c => c.status === ConsultationStatus.Realizado);

    const handleConfirmDelete = () => {
        deleteChild(child.id);
        setIsDeleteModalOpen(false);
    };

    const handleGenerateReport = () => {
        const reportContainer = document.createElement('div');
        document.body.appendChild(reportContainer);
        
        reportContainer.style.width = '210mm';
        reportContainer.style.position = 'absolute';
        reportContainer.style.left = '-210mm';
        reportContainer.style.top = '0';
        reportContainer.style.zIndex = '-1';

        const root = createRoot(reportContainer);
        root.render(<ChildReport child={child} />);

        setTimeout(() => {
            html2canvas(reportContainer, { scale: 3 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`relatorio_${child.name.replace(/\s/g, '_')}.pdf`);
                
                root.unmount();
                document.body.removeChild(reportContainer);
            });
        }, 500);
    };


    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                 <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">{child.name}</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsEditModalOpen(true)} className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" />
                            Editar
                        </button>
                        <button onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700">
                            <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                            Excluir
                        </button>
                    </div>
                 </div>
                 {isPuericultureComplete && (
                     <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">
                                    Puericultura Concluída!
                                    <button onClick={handleGenerateReport} className="ml-3 font-medium underline text-green-700 hover:text-green-600">
                                        Gerar Relatório Final (PDF)
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                 )}
                <div className="mt-4 border-t border-gray-200 pt-4">
                     <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Data de Nascimento</dt>
                            <dd className="mt-1 text-sm text-gray-900">{new Date(child.dateOfBirth).toLocaleDateString('pt-BR')}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Sexo</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.sex}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">CPF</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.cpf}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Nacionalidade</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.nationality}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Naturalidade</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.placeOfBirth}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Nome da Mãe</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.motherName}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Nome do Pai</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.fatherName}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Telefone/WhatsApp</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.contact}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Agente de Saúde</dt>
                            <dd className="mt-1 text-sm text-gray-900">{assignedAcs?.name || 'Não vinculado'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Histórico Familiar</dt>
                            <dd className="mt-1 text-sm text-gray-900">{child.familyHistory || 'Nenhum registro.'}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="border-t border-gray-200">
                <h4 className="sr-only">Consultas</h4>
                <ul role="list" className="divide-y divide-gray-200">
                    {child.consultations.map(consult => (
                        <li key={consult.id} className="p-4 hover:bg-gray-50">
                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex-1">
                                    <p className="text-md font-medium text-primary-700">{consult.milestone}</p>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        <CalendarDaysIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                                        Previsto: {new Date(consult.scheduledDate).toLocaleDateString('pt-BR')}
                                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[consult.status]}`}>
                                            {consult.status}
                                        </span>
                                    </p>
                                    {consult.performedDate && (
                                        <p className="text-xs text-gray-500 flex items-center mt-1">Realizado em: {new Date(consult.performedDate).toLocaleDateString('pt-BR')}</p>
                                    )}
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex space-x-2">
                                    <button onClick={() => setEditingConsultation(consult)} className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50" disabled={consult.status === ConsultationStatus.Enviado}>
                                        <PencilIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                                        {consult.status === ConsultationStatus.Realizado ? 'Editar' : 'Registrar'}
                                    </button>
                                     <button onClick={() => setReminderConsultation(consult)} className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50" disabled={consult.status === ConsultationStatus.Realizado}>
                                        <PaperAirplaneIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                                        Lembrete
                                    </button>
                                </div>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            {editingConsultation && (
                <Modal isOpen={!!editingConsultation} onClose={() => setEditingConsultation(null)} title={`Registrar Consulta: ${editingConsultation.milestone}`}>
                    <ConsultationForm childId={child.id} consultation={editingConsultation} onClose={() => setEditingConsultation(null)} />
                </Modal>
            )}

            {reminderConsultation && (
                <Modal isOpen={!!reminderConsultation} onClose={() => setReminderConsultation(null)} title={`Lembrete para: ${reminderConsultation.milestone}`}>
                    <ReminderModal child={child} consultation={reminderConsultation} onClose={() => setReminderConsultation(null)} />
                </Modal>
            )}

            {isEditModalOpen && (
                 <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Editar Cadastro de ${child.name}`}>
                    <ChildForm child={child} onClose={() => setIsEditModalOpen(false)} healthAgents={state.healthAgents} />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão">
                    <p>Você tem certeza que deseja excluir o cadastro de <strong>{child.name}</strong>? Esta ação é irreversível.</p>
                    <div className="flex justify-end space-x-2 pt-4 mt-4">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Cancelar</button>
                        <button onClick={handleConfirmDelete} className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700">Excluir</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ChildDetails;