// Tipos do domínio do sistema

export type UserRole = 'admin' | 'gestor' | 'usuario';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  sector?: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  active: boolean;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: 'scale' | 'multiple_choice' | 'text';
  options?: string[];
  category: string;
  active: boolean;
  createdAt: Date;
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'closed';
  companyId: string;
  createdAt: Date;
}

export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  answers: Answer[];
  submittedAt: Date;
  sector: string;
}

export interface Answer {
  questionId: string;
  value: string | number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
