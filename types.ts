export interface ACS {
  id: string;
  name: string;
  email: string;
  contact: string;
}

export enum ConsultationStatus {
  Pendente = 'Pendente',
  Criado = 'Lembrete Criado',
  Enviado = 'Lembrete Enviado',
  Realizado = 'Realizado',
}

export interface Consultation {
  id: string;
  milestone: string;
  scheduledDate: string;
  performedDate?: string;
  status: ConsultationStatus;
  weight?: number; // kg
  length?: number; // cm
  headCircumference?: number; // cm
  bmi?: number;
  observations?: string;
  reminder?: {
    whatsapp: string;
    emailSubject: string;
    emailBody: string;
  }
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: 'Masculino' | 'Feminino' | '';
  cpf: string;
  motherName: string;
  fatherName: string;
  contact: string;
  nationality: string;
  placeOfBirth: string; // Naturalidade (Cidade - UF)
  familyHistory?: string;
  acsId?: string;
  consultations: Consultation[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export type AppState = {
  children: Child[];
  healthAgents: ACS[];
  logs: LogEntry[];
  selectedChildId: string | null;
  lastUpdated?: string;
};

export type AppContextType = {
  state: AppState;
  isDirty: boolean;
  selectChild: (id: string | null) => void;
  addChild: (child: Omit<Child, 'id' | 'consultations'>) => void;
  updateChild: (child: Child) => void;
  deleteChild: (id: string) => void;
  addAcs: (acs: Omit<ACS, 'id'>) => void;
  updateAcs: (acs: ACS) => void;
  deleteAcs: (id: string) => void;
  updateConsultation: (childId: string, consultation: Consultation) => void;
  logAction: (message: string) => void;
  importState: (newState: AppState) => void;
  resetState: () => void;
  saveState: () => Promise<boolean>;
};
