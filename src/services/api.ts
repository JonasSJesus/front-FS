import {
  User,
  Company,
  Question,
  Questionnaire,
  QuestionnaireResponse,
  LoginCredentials,
  UserRole,
} from '@/types';

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== MOCK DATA ====================

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@empresa.com',
    role: 'admin',
    companyId: '1',
    createdAt: new Date('2024-01-01'),
  }
];

const mockCompanies: Company[] = [
  { id: '1', name: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', active: true, createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Saúde Corp', cnpj: '98.765.432/0001-10', active: true, createdAt: new Date('2024-02-01') },
];

const mockQuestions: Question[] = [
  { id: '1', text: 'Como você avalia seu nível de estresse no trabalho?', type: 'scale', category: 'Estresse', active: true, createdAt: new Date() },
  { id: '2', text: 'Você se sente valorizado pela empresa?', type: 'scale', category: 'Satisfação', active: true, createdAt: new Date() },
  { id: '3', text: 'Como está sua qualidade de sono?', type: 'scale', category: 'Saúde', active: true, createdAt: new Date() },
  { id: '4', text: 'Você consegue equilibrar vida pessoal e profissional?', type: 'scale', category: 'Equilíbrio', active: true, createdAt: new Date() },
  { id: '5', text: 'Como você descreveria o ambiente de trabalho?', type: 'multiple_choice', options: ['Excelente', 'Bom', 'Regular', 'Ruim'], category: 'Ambiente', active: true, createdAt: new Date() },
  { id: '6', text: 'Você se sente motivado para realizar suas tarefas?', type: 'scale', category: 'Motivação', active: true, createdAt: new Date() },
  { id: '7', text: 'Existem conflitos frequentes na sua equipe?', type: 'scale', category: 'Relacionamento', active: false, createdAt: new Date() },
  { id: '8', text: 'Você tem oportunidades de crescimento profissional?', type: 'scale', category: 'Carreira', active: true, createdAt: new Date() },
];

const mockQuestionnaires: Questionnaire[] = [
  {
    id: '1',
    title: 'Pesquisa de Bem-Estar Q4 2024',
    description: 'Avaliação trimestral do bem-estar dos colaboradores',
    questions: mockQuestions.slice(0, 5),
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    companyId: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Pesquisa de Clima Organizacional',
    description: 'Avaliação do clima e ambiente de trabalho',
    questions: mockQuestions.slice(2, 6),
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
    status: 'active',
    companyId: '1',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Pesquisa de Satisfação 2023',
    description: 'Avaliação anual de satisfação',
    questions: mockQuestions.slice(0, 4),
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-12-15'),
    status: 'closed',
    companyId: '1',
    createdAt: new Date(),
  },
];

// ==================== API SERVICES ====================

// Interface para padronizar respostas da API
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Serviço de Autenticação
 */
export const AuthService = {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    await delay(800);

    // Credenciais mockadas para teste
    const validCredentials: Record<string, { password: string; role: UserRole }> = {
      'admin@empresa.com': { password: 'admin123', role: 'admin' },
    };

    const userCredential = validCredentials[credentials.email];

    if (userCredential && userCredential.password === credentials.password) {
      const user = mockUsers.find(u => u.email === credentials.email);
      if (user) {
        return { data: user, success: true };
      }
    }

    throw new Error('Credenciais inválidas');
  },

  async logout(): Promise<void> {
    await delay(300);
    // TODO: Limpar token/sessão
  },

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    await delay(300);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return { data: JSON.parse(storedUser), success: true };
    }
    return { data: null, success: true };
  },
};

/**
 * Serviço de Usuários
 */
export const UserService = {
  async getAll(): Promise<ApiResponse<User[]>> {
    await delay(500);
    return { data: mockUsers, success: true };
  },

  async getById(id: string): Promise<ApiResponse<User | undefined>> {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    return { data: user, success: true };
  },

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    await delay(500);
    const newUser: User = {
      ...user,
      id: String(mockUsers.length + 1),
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    return { data: newUser, success: true, message: 'Usuário criado com sucesso' };
  },

  async update(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data };
      return { data: mockUsers[index], success: true, message: 'Usuário atualizado' };
    }
    throw new Error('Usuário não encontrado');
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return { data: undefined, success: true, message: 'Usuário removido' };
    }
    throw new Error('Usuário não encontrado');
  },
};

/**
 * Serviço de Empresas
 */
export const CompanyService = {
  async getAll(): Promise<ApiResponse<Company[]>> {
    await delay(500);
    return { data: mockCompanies, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Company | undefined>> {
    await delay(300);
    const company = mockCompanies.find(c => c.id === id);
    return { data: company, success: true };
  },

  async create(company: Omit<Company, 'id' | 'createdAt'>): Promise<ApiResponse<Company>> {
    await delay(500);
    const newCompany: Company = {
      ...company,
      id: String(mockCompanies.length + 1),
      createdAt: new Date(),
    };
    mockCompanies.push(newCompany);
    return { data: newCompany, success: true, message: 'Empresa criada com sucesso' };
  },

  async update(id: string, data: Partial<Company>): Promise<ApiResponse<Company>> {
    await delay(500);
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies[index] = { ...mockCompanies[index], ...data };
      return { data: mockCompanies[index], success: true };
    }
    throw new Error('Empresa não encontrada');
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies.splice(index, 1);
      return { data: undefined, success: true };
    }
    throw new Error('Empresa não encontrada');
  },
};

/**
 * Serviço de Perguntas (Banco de Perguntas)
 */
export const QuestionService = {
  async getAll(): Promise<ApiResponse<Question[]>> {
    await delay(500);
    return { data: mockQuestions, success: true };
  },

  async getActive(): Promise<ApiResponse<Question[]>> {
    await delay(300);
    return { data: mockQuestions.filter(q => q.active), success: true };
  },

  async create(question: Omit<Question, 'id' | 'createdAt'>): Promise<ApiResponse<Question>> {
    await delay(500);
    const newQuestion: Question = {
      ...question,
      id: String(mockQuestions.length + 1),
      createdAt: new Date(),
    };
    mockQuestions.push(newQuestion);
    return { data: newQuestion, success: true };
  },

  async update(id: string, data: Partial<Question>): Promise<ApiResponse<Question>> {
    await delay(500);
    const index = mockQuestions.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQuestions[index] = { ...mockQuestions[index], ...data };
      return { data: mockQuestions[index], success: true };
    }
    throw new Error('Pergunta não encontrada');
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(500);
    const index = mockQuestions.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQuestions.splice(index, 1);
      return { data: undefined, success: true };
    }
    throw new Error('Pergunta não encontrada');
  },

  async toggleActive(id: string): Promise<ApiResponse<Question>> {
    await delay(300);
    const index = mockQuestions.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQuestions[index].active = !mockQuestions[index].active;
      return { data: mockQuestions[index], success: true };
    }
    throw new Error('Pergunta não encontrada');
  },
};

/**
 * Serviço de Questionários
 */
export const QuestionnaireService = {
  async getAll(): Promise<ApiResponse<Questionnaire[]>> {
    await delay(500);
    return { data: mockQuestionnaires, success: true };
  },

  async getActive(): Promise<ApiResponse<Questionnaire[]>> {
    await delay(300);
    return { data: mockQuestionnaires.filter(q => q.status === 'active'), success: true };
  },

  async getPending(userId: string): Promise<ApiResponse<Questionnaire[]>> {
    await delay(500);
    // Simula questionários pendentes para o usuário
    const pending = mockQuestionnaires.filter(q => q.status === 'active');
    return { data: pending, success: true };
  },

  async getById(id: string): Promise<ApiResponse<Questionnaire | undefined>> {
    await delay(300);
    const questionnaire = mockQuestionnaires.find(q => q.id === id);
    return { data: questionnaire, success: true };
  },

  async create(questionnaire: Omit<Questionnaire, 'id' | 'createdAt'>): Promise<ApiResponse<Questionnaire>> {
    await delay(500);
    const newQuestionnaire: Questionnaire = {
      ...questionnaire,
      id: String(mockQuestionnaires.length + 1),
      createdAt: new Date(),
    };
    mockQuestionnaires.push(newQuestionnaire);
    return { data: newQuestionnaire, success: true };
  },

  async update(id: string, data: Partial<Questionnaire>): Promise<ApiResponse<Questionnaire>> {
    await delay(500);
    const index = mockQuestionnaires.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQuestionnaires[index] = { ...mockQuestionnaires[index], ...data };
      return { data: mockQuestionnaires[index], success: true };
    }
    throw new Error('Questionário não encontrado');
  },

  async submitResponse(response: Omit<QuestionnaireResponse, 'id' | 'submittedAt'>): Promise<ApiResponse<void>> {
    await delay(800);
    // Simula o envio da resposta
    console.log('Resposta enviada:', response);
    return { data: undefined, success: true, message: 'Resposta enviada com sucesso!' };
  },
};
