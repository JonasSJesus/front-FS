import React, { useState, useEffect } from 'react';
import { QuestionService } from '@/services/api';
import { Question } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HelpCircle, Plus, Pencil, Trash2, Search, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    type: 'scale' as Question['type'],
    category: '',
    options: '',
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Estresse', 'Satisfação', 'Saúde', 'Equilíbrio', 'Ambiente', 'Motivação', 'Relacionamento', 'Carreira'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await QuestionService.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setSelectedQuestion(question);
      setFormData({
        text: question.text,
        type: question.type,
        category: question.category,
        options: question.options?.join(', ') || '',
        active: question.active,
      });
    } else {
      setSelectedQuestion(null);
      setFormData({ text: '', type: 'scale', category: '', options: '', active: true });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        text: formData.text,
        type: formData.type,
        category: formData.category,
        active: formData.active,
        options: formData.type === 'multiple_choice' 
          ? formData.options.split(',').map(o => o.trim()).filter(Boolean) 
          : undefined,
      };

      if (selectedQuestion) {
        await QuestionService.update(selectedQuestion.id, data);
        toast({ title: 'Sucesso', description: 'Pergunta atualizada com sucesso' });
      } else {
        await QuestionService.create(data);
        toast({ title: 'Sucesso', description: 'Pergunta criada com sucesso' });
      }
      setDialogOpen(false);
      fetchQuestions();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar a pergunta', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (question: Question) => {
    try {
      await QuestionService.toggleActive(question.id);
      toast({ 
        title: 'Status atualizado', 
        description: `Pergunta ${question.active ? 'desativada' : 'ativada'} com sucesso` 
      });
      fetchQuestions();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o status', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;
    
    try {
      await QuestionService.delete(selectedQuestion.id);
      toast({ title: 'Sucesso', description: 'Pergunta removida com sucesso' });
      setDeleteDialogOpen(false);
      fetchQuestions();
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível remover a pergunta', variant: 'destructive' });
    }
  };

  const getTypeBadge = (type: Question['type']) => {
    const styles = {
      scale: 'bg-primary/10 text-primary',
      multiple_choice: 'bg-info/10 text-info',
      text: 'bg-warning/10 text-warning',
    };
    const labels = { scale: 'Escala', multiple_choice: 'Múltipla Escolha', text: 'Texto' };
    return <Badge variant="secondary" className={styles[type]}>{labels[type]}</Badge>;
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(questions.map(q => q.category))];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banco de Perguntas</h1>
          <p className="text-muted-foreground">
            Gerencie as perguntas disponíveis para questionários
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}</DialogTitle>
              <DialogDescription>
                {selectedQuestion ? 'Atualize os dados da pergunta' : 'Crie uma nova pergunta para o banco'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Texto da Pergunta</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Digite a pergunta..."
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Question['type']) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scale">Escala (1-10)</SelectItem>
                      <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                      <SelectItem value="text">Texto Livre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {formData.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <Label htmlFor="options">Opções (separadas por vírgula)</Label>
                  <Input
                    id="options"
                    value={formData.options}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                    placeholder="Opção 1, Opção 2, Opção 3"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Pergunta ativa</Label>
              </div>
              <DialogFooter>
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
            placeholder="Buscar pergunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total: {questions.length}</span>
        <span>•</span>
        <span className="text-success">Ativas: {questions.filter(q => q.active).length}</span>
        <span>•</span>
        <span className="text-muted-foreground">Inativas: {questions.filter(q => !q.active).length}</span>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma pergunta encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question, index) => (
            <Card
              key={question.id}
              className={`animate-slide-up transition-all ${!question.active ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  {getTypeBadge(question.type)}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleActive(question)}
                    >
                      {question.active ? (
                        <ToggleRight className="h-4 w-4 text-success" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(question)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base line-clamp-2">{question.text}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{question.category}</Badge>
                  <Badge variant={question.active ? 'default' : 'secondary'}>
                    {question.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                {question.options && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Opções: {question.options.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Questions;
