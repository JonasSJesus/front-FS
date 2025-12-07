## 🧩 Visão Geral do Sistema

O **Sistema de Pesquisa de Saúde Mental Corporativa** tem como objetivo coletar, analisar e apresentar dados sobre o bem-estar psicológico dos colaboradores de empresas, por meio de **questionários digitais anônimos**.

Essas informações são processadas e transformadas em **relatórios automatizados por setor**, permitindo à gestão identificar áreas com maior risco de sobrecarga emocional, estresse ou insatisfação.

---

## 🎯 Objetivos do Sistema

- Facilitar o monitoramento contínuo da saúde mental dos colaboradores.
    
- Garantir **anonimato e segurança** das respostas.
    
- Automatizar a **geração de relatórios estatísticos e gráficos**.
    
- Fornecer acesso hierárquico e controlado às informações.
    
- Apoiar a **tomada de decisão** com base em dados.
    
- Permitir **integração multiempresa (multitenant)**.
    
- Incluir **elementos de gamificação e vídeos educativos**.
    

---

## 👥 Perfis de Usuário

|Perfil|Descrição|
|---|---|
|**Administrador**|Gerencia empresas, funcionários e formulários. Tem acesso a todos os relatórios e autoriza o envio para gerentes.|
|**Gerente**|Recebe e visualiza relatórios apenas de seu setor.|
|**Funcionário / Usuário**|Responde aos questionários de forma anônima. Pode assistir a vídeos e participar de quizzes.|

---

## ⚙️ Requisitos Funcionais (RF)

| Código   | Requisito Funcional                         | Descrição                                                                                                                                                                         |
| -------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RF01** | Cadastro de Empresas                        | O sistema deve permitir o cadastro e gestão de empresas.                                                                                                                          |
| **RF02** | Cadastro de Funcionários                    | O administrador pode cadastrar funcionários com nome, e-mail, setor e cargo. O sistema envia o login por e-mail.                                                                  |
| **RF03** | Autenticação                                | O login deve ser feito via e-mail e senha, com uso de **JWT** para autenticação.                                                                                                  |
| **RF04** | Perfis e Permissões                         | Deve existir controle de acesso baseado em **roles** (admin, gerente, funcionário).                                                                                               |
| **RF05** | Banco de Perguntas                          | O administrador deve poder criar, editar e excluir perguntas que compõem os questionários. (CRUD)                                                                                 |
| **RF06** | Cadastro e Controle de Questionários        | O administrador define as perguntas, períodos em que as perguntas deverão ser aplicadas, e abertura/fechamento de cada pesquisa.                                                  |
| **RF07** | Preenchimento de Questionário               | O funcionário responde o formulário dentro do prazo estabelecido. As respostas são anônimas.                                                                                      |
| **RF08** | Anonimização de Respostas                   | O sistema armazena as respostas sem vínculo direto com a identidade do funcionário.                                                                                               |
| **RF09** | Relatórios Automáticos                      | O sistema gera relatórios automáticos com indicadores e gráficos, agrupados por setor.                                                                                            |
| **RF10** | Acesso aos Relatórios                       | O administrador tem acesso total; o gerente apenas aos relatórios de seu setor.                                                                                                   |
| **RF11** | Exportação de Relatórios                    | O sistema deve permitir exportar relatórios das pesquisas em **PDF** e **CSV**.                                                                                                   |
| **RF12** | Notificações                                | O sistema envia notificações (por e-mail ou internas) quando:  <br>• houver questionário pendente;  <br>• a data limite estiver próxima;  <br>• novos relatórios forem liberados. |
| **RF13** | Controle de Ciclo                           | Cada ciclo de questionário possui prazo e reenvio automático de lembretes semanais para funcionários que ainda não finalizaram a pesquisa.                                        |
| **RF14** | Vídeos e Gamificação                        | O sistema deve exibir vídeos educativos com:  <br>• controle de tempo assistido;  <br>• bloqueio de reapresentação;  <br>• quizzes sobre o conteúdo.                              |
| **RF15** | Dashboard Analítico                         | O sistema deve apresentar gráficos consolidados de desempenho e saúde emocional.                                                                                                  |
| **RF16** | Carga e Exportação de Dados de funcionários | O sistema deve ser capaz de rodar uma carga de dados dos funcionários da empresa. Pode ser feito através de importação via **CSV** dos funcionários                               |
| **RF17** | Pagamentos                                  | O sistema deve permitir o controle de pagamentos associados às empresas cadastradas.                                                                                              |
| **RF18** | Horário de Funcionamento                    | Deve ser possível configurar o horário comercial para permitir ou restringir o preenchimento.                                                                                     |


---

## 🧠 Regras de Negócio (RN)

| Código   | Regra de Negócio        | Descrição                                                                                                        |
| -------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **RN01** | Anonimato Garantido     | Nenhuma resposta ou relatório pode conter dados que identifiquem diretamente o funcionário.                      |
| **RN02** | Prazo de Resposta       | O funcionário tem até **1 semana** para responder ao questionário após o envio.                                  |
| **RN03** | Reenvio Automático      | Caso o funcionário não responda, o sistema reenviará lembretes dentro desse prazo.                               |
| **RN04** | Restrição de Horário    | O preenchimento pode ser limitado ao horário comercial, conforme configuração da empresa.                        |
| **RN05** | Uma Resposta por Ciclo  | Cada funcionário pode responder **apenas uma vez** por ciclo ativo.                                              |
| **RN06** | Confirmação de Envio    | O usuário deve confirmar o envio antes do registro das respostas.                                                |
| **RN07** | Bloqueio de Alterações  | Após o envio, não será possível alterar as respostas.                                                            |
| **RN08** | Liberação de Relatório  | O relatório só é gerado após um número mínimo de respostas (configurável) e não deve ser liberado imediatamente. |
| **RN09** | Acesso Hierárquico      | Apenas o administrador pode visualizar relatórios completos; gerentes têm acesso restrito ao seu setor.          |
| **RN10** | Integridade dos Dados   | O sistema não deve permitir a exclusão de respostas consolidadas em relatórios.                                  |
| **RN11** | Encerramento de Ciclo   | O administrador é notificado automaticamente quando o ciclo da pesquisa terminar.                                |
| **RN12** | Controle de Formulários | Somente o administrador pode criar, editar ou desativar formulários.                                             |
| **RN13** | Vídeos Assistidos       | Vídeos já assistidos não devem reaparecer para o mesmo usuário.                                                  |
| **RN14** | Gamificação             | A pontuação ou progresso pode ser calculada conforme vídeos assistidos e quizzes respondidos.                    |

---

## 🧱 Requisitos Não Funcionais (RNF)

|Código|Requisito Não Funcional|Descrição|
|---|---|---|
|**RNF01**|Segurança|Senhas devem ser armazenadas criptografadas (ex: bcrypt).|
|**RNF02**|Privacidade|Deve haver anonimização e conformidade total com a **LGPD**.|
|**RNF03**|Usabilidade|Interface deve ser responsiva e intuitiva.|
|**RNF04**|Desempenho|O sistema deve suportar até **500 usuários simultâneos** sem lentidão perceptível.|
|**RNF05**|Disponibilidade|Disponibilidade mínima de **99%**.|
|**RNF06**|Compatibilidade|Compatível com Chrome, Edge, Firefox e Safari.|
|**RNF07**|Acessibilidade|Deve seguir boas práticas **WCAG 2.1**.|
|**RNF08**|Backup|Backup automático diário do banco de dados.|
|**RNF09**|Escalabilidade|Deve suportar múltiplas empresas (arquitetura **multitenant**).|
|**RNF10**|Conformidade Legal|O sistema deve atender integralmente à **LGPD**.|

---

## 🔁 Fluxo Geral do Sistema

1. **Administrador cadastra empresa e funcionários.**
    
2. **Funcionário recebe e-mail com credenciais.**
    
3. **Administrador cria o questionário com as perguntas do banco e define o ciclo.**
    
4. **Funcionários respondem anonimamente dentro do prazo.**
    
5. **Sistema gera relatórios e gráficos automaticamente.**
    
6. **Administrador valida e libera relatórios.**
    
7. **Gerente acessa relatórios de seu setor.**
    
8. **Relatórios e vídeos são apresentados em um dashboard analítico.**

