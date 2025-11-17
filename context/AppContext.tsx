import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, AppContextType, Child, Consultation, ACS, ConsultationStatus } from '../types';
import { generateConsultationSchedule } from '../utils/dateUtils';

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultState: AppState = {
    children: [],
    healthAgents: [],
    logs: [{ id: '1', timestamp: new Date().toISOString(), message: 'Sistema iniciado.' }],
    selectedChildId: null,
};


// --- Functions to generate demo data ---
const createDemoData = (): AppState => {
    const initialAcs: ACS[] = [
        { id: 'acs1', name: 'Carlos Ferreira', email: 'carlos.f@example.com', contact: '11987654321' },
        { id: 'acs2', name: 'Beatriz Lima', email: 'beatriz.l@example.com', contact: '21912345678' },
    ];

    const calculateBMI = (w: number, l: number): number | undefined => {
        if (w > 0 && l > 0) {
            const lengthInMeters = l / 100;
            return parseFloat((w / (lengthInMeters * lengthInMeters)).toFixed(2));
        }
        return undefined;
    };

    const demoChildDob = new Date();
    demoChildDob.setMonth(demoChildDob.getMonth() - 18);
    const demoChildDobString = demoChildDob.toISOString().split('T')[0];

    const demoConsultations = generateConsultationSchedule(demoChildDobString);
    const growthData = [
        [0, 3.2, 50, 35], [1, 3.4, 51, 35.5], [2, 4.2, 54, 37], [3, 5.1, 58, 38.5],
        [4, 6.3, 62, 40], [5, 7.5, 66, 42], [6, 8.8, 71, 43.5], [7, 9.7, 75, 45],
        [8, 10.5, 78, 46], [9, 11.2, 81, 47],
    ];

    growthData.forEach(([index, weight, length, headCircumference]) => {
        if (demoConsultations[index]) {
            demoConsultations[index] = {
                ...demoConsultations[index],
                status: ConsultationStatus.Realizado,
                performedDate: demoConsultations[index].scheduledDate,
                weight: weight, length: length, headCircumference: headCircumference,
                bmi: calculateBMI(weight, length),
                observations: 'Desenvolvimento dentro do esperado para a idade.'
            };
        }
    });

    const initialChildren: Child[] = [
      {
        id: '1', name: 'Ana Clara Souza',
        dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
        sex: 'Feminino', cpf: '111.222.333-44', motherName: 'Mariana Souza', fatherName: 'Ricardo Souza',
        contact: '11999998888', nationality: 'Brasileira',
        placeOfBirth: 'São Paulo - SP', familyHistory: 'Avó materna com diabetes tipo 2.', acsId: 'acs1',
        consultations: generateConsultationSchedule(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]),
      },
      {
        id: '2', name: 'Lucas Almeida', dateOfBirth: demoChildDobString, sex: 'Masculino',
        cpf: '222.333.444-55', motherName: 'Juliana Almeida', fatherName: 'Fernando Almeida',
        contact: '21988887777', nationality: 'Brasileira',
        placeOfBirth: 'Rio de Janeiro - RJ', familyHistory: 'Sem histórico familiar relevante.', acsId: 'acs2',
        consultations: demoConsultations,
      }
    ];

    return {
        children: initialChildren,
        healthAgents: initialAcs,
        logs: [
            { id: '2', timestamp: new Date().toISOString(), message: 'Dados de demonstração para "Lucas Almeida" carregados.' },
            { id: '1', timestamp: new Date().toISOString(), message: 'Sistema iniciado.' },
        ],
        selectedChildId: '2',
    };
};

const writeStateToLocalStorage = (state: AppState): boolean => {
    try {
        localStorage.setItem('puericulturaAppState', JSON.stringify(state));
        return true;
    } catch (error) {
        console.error("Error writing to localStorage", error);
        return false;
    }
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
        const savedStateJSON = localStorage.getItem('puericulturaAppState');
        if (savedStateJSON) {
            return JSON.parse(savedStateJSON);
        }
    } catch (error) {
        console.error("Failed to load state from localStorage", error);
    }
    const demoData = createDemoData();
    demoData.lastUpdated = new Date().toISOString();
    writeStateToLocalStorage(demoData);
    return demoData;
  });
  const [isDirty, setIsDirty] = useState(false);

  const logAction = (message: string) => {
    setState(prevState => ({
      ...prevState,
      logs: [{ id: Date.now().toString(), timestamp: new Date().toISOString(), message }, ...prevState.logs],
    }));
    setIsDirty(true);
  };

  const selectChild = (id: string | null) => {
    setState(prevState => ({ ...prevState, selectedChildId: id }));
    if(id) {
        const child = state.children.find(c => c.id === id);
        if (child) {
            logAction(`Visualizando detalhes de "${child.name}".`);
        }
    }
  };

  const addChild = (childData: Omit<Child, 'id' | 'consultations'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      consultations: generateConsultationSchedule(childData.dateOfBirth),
    };
    setState(prevState => ({
      ...prevState,
      children: [...prevState.children, newChild],
    }));
    setIsDirty(true);
    logAction(`Criança "${newChild.name}" foi cadastrada.`);
  };

  const updateChild = (updatedChild: Child) => {
    setState(prevState => ({
      ...prevState,
      children: prevState.children.map(child =>
        child.id === updatedChild.id ? updatedChild : child
      ),
    }));
    setIsDirty(true);
    logAction(`Dados da criança "${updatedChild.name}" foram atualizados.`);
  };

  const deleteChild = (id: string) => {
    const childToDelete = state.children.find(c => c.id === id);
    if (childToDelete) {
        setState(prevState => ({
            ...prevState,
            children: prevState.children.filter(child => child.id !== id),
            selectedChildId: prevState.selectedChildId === id ? null : prevState.selectedChildId,
        }));
        setIsDirty(true);
        logAction(`Cadastro da criança "${childToDelete.name}" foi removido.`);
    }
  };
  
  const updateConsultation = (childId: string, updatedConsultation: Consultation) => {
    const child = state.children.find(c => c.id === childId);
    if (!child) return;
    
    setState(prevState => {
      const children = prevState.children.map(c => {
        if (c.id === childId) {
          const consultations = c.consultations.map(cons =>
            cons.id === updatedConsultation.id ? updatedConsultation : cons
          );
          return { ...c, consultations };
        }
        return c;
      });
      return { ...prevState, children };
    });
    setIsDirty(true);
    logAction(`Consulta de "${updatedConsultation.milestone}" para "${child.name}" foi atualizada para o status "${updatedConsultation.status}".`);
  };

  const addAcs = (acsData: Omit<ACS, 'id'>) => {
    const newAcs: ACS = { ...acsData, id: Date.now().toString() };
    setState(prevState => ({
        ...prevState,
        healthAgents: [...prevState.healthAgents, newAcs]
    }));
    setIsDirty(true);
    logAction(`Agente de Saúde "${newAcs.name}" foi cadastrado.`);
  };

  const updateAcs = (updatedAcs: ACS) => {
    setState(prevState => ({
        ...prevState,
        healthAgents: prevState.healthAgents.map(a => a.id === updatedAcs.id ? updatedAcs : a),
    }));
    setIsDirty(true);
    logAction(`Dados do Agente de Saúde "${updatedAcs.name}" foram atualizados.`);
  };

  const deleteAcs = (id: string) => {
    const acsToDelete = state.healthAgents.find(a => a.id === id);
    if (acsToDelete) {
        setState(prevState => ({
            ...prevState,
            healthAgents: prevState.healthAgents.filter(a => a.id !== id),
            children: prevState.children.map(c => c.acsId === id ? { ...c, acsId: undefined } : c)
        }));
        setIsDirty(true);
        logAction(`Agente de Saúde "${acsToDelete.name}" foi removido e desvinculado das crianças.`);
    }
  };

  const saveState = async (): Promise<boolean> => {
    const timestamp = new Date().toISOString();
    const stateToSave: AppState = {
        ...state,
        logs: [{ id: Date.now().toString(), timestamp, message: 'Dados consolidados e salvos com sucesso.' }, ...state.logs],
        lastUpdated: timestamp,
    };

    if (writeStateToLocalStorage(stateToSave)) {
        setState(stateToSave);
        setIsDirty(false);
        return true;
    }
    return false;
  };

  const importState = (newState: AppState) => {
    if (newState && Array.isArray(newState.children) && Array.isArray(newState.healthAgents) && Array.isArray(newState.logs)) {
        const stateToImport: AppState = {
            ...newState,
            lastUpdated: new Date().toISOString(),
        };
        const message = 'Banco de dados importado com sucesso a partir de arquivo.';
        stateToImport.logs = [{ id: Date.now().toString(), timestamp: stateToImport.lastUpdated, message }, ...stateToImport.logs];

        if (writeStateToLocalStorage(stateToImport)) {
            setState(stateToImport);
            setIsDirty(false);
        }
    } else {
        logAction('Falha na importação: o arquivo é inválido ou está corrompido.');
        alert('O arquivo selecionado não é um backup válido do sistema.');
    }
  };

  const resetState = () => {
    const timestamp = new Date().toISOString();
    const freshState: AppState = {
        ...defaultState,
        logs: [{ id: Date.now().toString(), timestamp, message: 'Banco de dados foi formatado. Todos os dados foram removidos.' }],
        lastUpdated: timestamp,
    };
    if (writeStateToLocalStorage(freshState)) {
        setState(freshState);
        setIsDirty(false);
    }
  };


  return (
    <AppContext.Provider value={{ state, isDirty, saveState, selectChild, addChild, updateChild, deleteChild, addAcs, updateAcs, deleteAcs, updateConsultation, logAction, importState, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
