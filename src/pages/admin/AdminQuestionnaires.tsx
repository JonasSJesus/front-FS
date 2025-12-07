import React, { useState, useEffect } from 'react';
import { QuestionnaireService, QuestionService, CompanyService } from '@/services/api';
import { Questionnaire, Question, Company } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, Plus, Eye, Pencil, Search, Loader2, Calendar, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const AdminQuestionnaires: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    companyId: '',
    status: 'draft' as Questionnaire['status'],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [questionnairesRes, questionsRes, companiesRes] = await Promise.all([
        QuestionnaireService.getAll(),
        QuestionService.getActive(),
        CompanyService.getAll(),
      ]);
      setQuestionnaires(questionnairesRes.data);
      setQuestions(questionsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (questionnaire?: Questionnaire) => {
    if (questionnaire) {
      setSelectedQuestionnaire(questionnaire);
      setFormData({
        title: questionnaire.title,
        description: questionnaire.description,
        startDate: format(new Date(questionnaire.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(questionnaire.endDate), 'yyyy-MM-dd'),
        companyId: questionnaire.companyId,
        status: questionnaire.status,
      });
      setSelectedQuestions(questionnaire.questions.map(q => q.id));
    } else {
      setSelectedQuestionnaire(null);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        companyId: '',
        status: 'draft',
      });
      setSelectedQuestions([]);
    }
    setDialogOpen(true);
  };

  const handleToggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedQuestions.length === 0) {
      toast({ title: 'Atenção', description: 'Selecione ao menos uma pergunta', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    try {
      const selectedQuestionObjects = questions.filter(q => selectedQuestions.includes(q.id));
      
      const data = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        questions: selectedQuestionObjects,
      };

      if (selectedQuestionnaire) {
        await QuestionnaireService.update(selectedQuestionnaire.id, data);
        toast({ title: 'Sucesso', description: 'Questionário atualizado com sucesso' });
      } else {
        await QuestionnaireService.create(data);
        toast({ title: 'Sucesso', description: 'Questionário criado com sucesso' });
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar o questionário', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: Questionnaire['status']) => {
    const styles = {
      draft: 'bg-muted text-muted-foreground',
      active: 'bg-success/10 text-success',
      closed: 'bg-destructive/10 text-destructive',
    };
    const labels = { draft: 'Rascunho', active: 'Ativo', closed: 'Encerrado' };
    return <Badge variant="secondary" className={styles[status]}>{labels[status]}</Badge>;
  };

  const filteredQuestionnaires = questionnaires.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Group questions by category for better organization
  const questionsByCategory = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Questionários</h1>
          <p className="text-muted-foreground">
            Monte e gerencie questionários de pesquisa
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Questionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {selectedQuestionnaire ? 'Editar Questionário' : 'Novo Questionário'}
              </DialogTitle>
              <DialogDescription>
                Configure o questionário e selecione as perguntas
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="questions">
                    Perguntas ({selectedQuestions.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Título do questionário"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição do questionário"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de Início</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Término</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Select
                        value={formData.companyId}
                        onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: Questionnaire['status']) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="closed">Encerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
                        <div key={category}>
                          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {categoryQuestions.map((question) => (
                              <div
                                key={question.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                  selectedQuestions.includes(question.id)
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted hover:border-muted-foreground/20'
                                }`}
                              >
                                <Checkbox
                                  id={question.id}
                                  checked={selectedQuestions.includes(question.id)}
                                  onCheckedChange={() => handleToggleQuestion(question.id)}
                                />
                                <div className="flex-1 min-w-0">
                                  <label
                                    htmlFor={question.id}
                                    className="text-sm cursor-pointer block"
                                  >
                                    {question.text}
                                  </label>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {question.type === 'scale' ? 'Escala' : 
                                     question.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Texto'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar questionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="closed">Encerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Perguntas</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestionnaires.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum questionário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestionnaires.map((questionnaire) => (
                  <TableRow key={questionnaire.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <ClipboardList className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{questionnaire.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {questionnaire.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{questionnaire.questions.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(questionnaire.startDate), 'dd/MM/yy')} -{' '}
                          {format(new Date(questionnaire.endDate), 'dd/MM/yy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(questionnaire.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(questionnaire)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQuestionnaires;
