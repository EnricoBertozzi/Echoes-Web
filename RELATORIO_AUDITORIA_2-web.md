# Relatório de auditoria 2 — front-end

## 1. Resumo

- **Data:** 20/11/2026.
- **Repositório:** `Echoes-Web`.
- **BASE:** `f4bab4b8155de8c67c7e7c3a4a2bcc67525496f8` (`git rev-parse HEAD` registrado na preparação).
- **Objetivo do acompanhamento:** exibir nome, papel e instituição do autor nos eventos de auditoria; manter o IP restrito ao que o back-end devolve para `ADMIN`; mostrar e-mails mascarados nas listagens; e oferecer um botão de olho que busque o e-mail completo por um endpoint auditado.
- **Estado prévio:** antes de qualquer edição, `git status --short` foi registrado e o original de cada arquivo foi copiado para `/tmp/audit2-original/Echoes-Web/`. Os diffs descritos abaixo foram obtidos por comparação com essas cópias.
- **Repositórios separados:** back-end e front-end são repositórios Git distintos. Por isso este é o segundo arquivo de relatório, complementar ao `RELATORIO_AUDITORIA_2.md` do `Echoes-Server-production`.
- **Idioma:** identificadores de código permanecem em inglês; rótulos, mensagens e comentários inseridos estão em português brasileiro.

## 2. Arquivos alterados

| Arquivo | Classe/Componente | Método/Função | Tipo | Resumo |
| --- | --- | --- | --- | --- |
| `app/types/audit.ts` | `AuditLog` | — | Alteração | Interface ganha `actorName`, `actorRole` e `actorInstitutionName`. |
| `app/utils/auditLabels.ts` | rótulos e frases | `describeActor()`, `describeAuditLog()` | Alteração | Rótulos de papel, frase `VIEW_EMAIL` e descrição do autor pela foto gravada no log. |
| `app/components/organisms/AuditLogTable.tsx` | `AuditLogTable` | `AuditLogTable()` | Alteração | Coluna "Autor" mostra nome, papel e instituição; mantém o fallback para id. |
| `app/components/organisms/AuditDetailsModal.tsx` | `AuditDetailsModal` | `AuditDetailsModal()` | Alteração | Modal exibe "Autor", "Papel" e "Instituição do autor" quando presentes. |
| `app/api/users.ts` | cliente de usuários | `findUserEmail()` | Alteração | Função que consome `GET /api/v1/users/{id}/email`. |
| `app/components/molecules/users/UserCard.tsx` | `UserCard` | `toggleEmail()` | Alteração | Estado local do e-mail revelado e botão de olho com ícones e textos em português. |
| `app/pages/users/InstitutionUsersPage.tsx` | `InstitutionUsersPage` | `InstitutionUsersPage()` | Alteração | Passa `id={member.id}` ao `UserCard`. |
| `app/pages/users/AdminUsersPage.tsx` | `AdminPageUsers` | `AdminPageUsers()` | Alteração | Passa `id={user.id}` ao `UserCard`. |

Nenhum arquivo de teste foi alterado; o projeto não trouxe asserções que exigissem atualização. Nenhuma dependência foi acrescentada.

## 3. Submódulos

### 3.1 Tipos e rótulos da auditoria

**Antes.** `AuditLog` tinha `userId`, mas nenhum campo de autor. `describeAuditLog()` montava a frase com `Usuário ${log.userId.slice(0, 8)}` ou `Sistema`, e não existia rótulo para a ação `VIEW_EMAIL`.

**Depois.** A interface passou a declarar `actorName`, `actorRole` e `actorInstitutionName` como `string | null`, imediatamente após `userId`. Em `auditLabels.ts` foi criado `roleLabels` (`ADMIN`, `MANAGER`, `TEACHER`, `STUDENT`, `DEVICE`), foram adicionados `VIEW_EMAIL: "E-mail visualizado"` em `actionLabels` e `VIEW_EMAIL: "visualizou o e-mail do usuário"` em `actionPhrases`, e a descrição foi dividida: `describeActor()` prefere o nome e o papel gravados, usa o id curto quando só ele existe e devolve "Sistema" quando não há nenhum dos dois; `describeAuditLog()` continua concatenando autor e frase da ação.

**Como funciona agora.** Os campos vindos do back-end são tipados e a mesma regra de descrição alimenta a tabela e o modal. Ações `VIEW_EMAIL` passam a aparecer em português tanto no rótulo da coluna "Evento" quanto na frase completa.

**Impacto.** Mudança aditiva no tipo: registros antigos, sem os campos novos, continuam caindo no fallback de id curto ou "Sistema". Nenhuma lista, filtro ou paginação foi alterado.

### 3.2 Tabela e modal de detalhes

**Antes.** A coluna "Autor" da tabela mostrava apenas `log.userId` em fonte monoespaçada, com `title` para o id completo. O modal exibia a linha fixa `["Autor (ID)", log.userId ?? "—"]` e nada mais sobre quem agiu.

**Depois.** `AuditLogTable` importa `roleLabels` e, quando `actorName` existe, mostra o nome em destaque com papel e instituição na linha abaixo; quando não existe, mantém o bloco monoespaçado antigo com o id e o `title`. `AuditDetailsModal` acrescenta ao array `metadata`, condicionalmente, "Autor", "Papel" (via `roleLabels`) e "Instituição do autor", e sempre acrescenta "Autor (ID)" logo depois; o valor dessa última linha recebe `font-mono text-xs` para preservar a leitura do UUID.

**Como funciona agora.** Tabela e modal usam a mesma informação gravada no log, sem consultar o cadastro atual do usuário. A instituição do evento permanece na coluna própria, quando o usuário é `ADMIN`, e o IP continua aparecendo apenas se o back-end tiver devolvido valor não nulo: `showIp` na tabela e `log.ip !== null` no modal.

**Impacto.** Melhor legibilidade da trilha de auditoria sem alterações relevantes na largura das demais colunas; nenhuma decisão de permissão foi movida para o front-end.

### 3.3 Cliente da API e botão de olho

**Antes.** `api/users.ts` não tinha acesso ao e-mail completo fora da listagem. `UserCard` recebia `name`, `email`, `role` e `onDelete`, e exibia `email` diretamente, sem controle de revelação.

**Depois.** Foi adicionado `findUserEmail(id)` em `api/users.ts`, usando a instância `api` existente e devolvendo `response.data.email`. `UserCard` ganhou `id?: string`, os estados `revealedEmail` e `loading` e a função `toggleEmail()`: se já há e-mail revelado, apenas limpa o estado (sem requisição); se não há `id`, não faz nada; caso contrário, marca carregamento, chama `findUserEmail(id)` e guarda o resultado. Erros são silenciados no `catch` com o comentário "o interceptor do axios já mostrou o erro", evitando um segundo aviso. O botão usa `FiEye`/`FiEyeOff`, `aria-label` e `title` alternando entre "Mostrar e-mail" e "Ocultar e-mail", e fica desabilitado durante a requisição. A prop `id` permaneceu opcional para não obrigar a alterar `ClassroomInfoPage.tsx`, que está fora do escopo; nessa página o botão simplesmente não aparece.

**Como funciona agora.** Por padrão o card mostra o e-mail mascarado devolvido pela listagem. Cada revelação faz uma chamada nova ao endpoint auditado; ocultar é apenas local. `InstitutionUsersPage` passa `id={member.id}` e `AdminUsersPage` passa `id={user.id}`, habilitando o botão nessas duas telas.

**Impacto.** A revelação deixa de ser implícita e passa a depender de uma ação explícita do usuário, registrada no back-end como `VIEW_EMAIL`. Nenhuma mensagem de erro nova foi criada e nenhum toast duplicado é emitido.

## 4. Impacto geral

- Oito arquivos foram tocados: quatro de auditoria (`audit.ts`, `auditLabels.ts`, `AuditLogTable.tsx`, `AuditDetailsModal.tsx`) e quatro de usuários (`api/users.ts`, `UserCard.tsx`, `InstitutionUsersPage.tsx`, `AdminUsersPage.tsx`).
- A interface `AuditLog` é a única mudança de contrato consumida por outras telas e é retrocompatível porque os campos novos são anuláveis.
- A página de membros de turma (`ClassroomInfoPage.tsx`) permaneceu sem alteração e, portanto, sem o botão de olho, conforme o escopo definido.
- Nenhuma biblioteca, rota do React Router, estilo global ou configuração de build foi alterada.

## 5. Step 0 — confirmação da regra de IP

A checagem definitiva da regra de IP foi registrada no repositório do back-end: `AuditLogController` passa `user.getUserRole() == UserRole.ADMIN` a `AuditLogDTO.from(log, includeIp)`, e o DTO preenche `ip` somente quando `includeIp` é verdadeiro.

No front-end foi confirmado que nada tenta contornar essa regra: `AuditLogTable` continua calculando `showIp` a partir de `logs.some((log) => log.ip !== null)` e só renderiza a coluna "IP" quando há algum valor; `AuditDetailsModal` só inclui "Endereço IP" quando `log.ip !== null`. Nenhuma dessas condições foi alterada nesta entrega, e nenhum campo de IP passou a ser enviado pelo cliente. Não houve edição nesta etapa.

## 6. Verificação

Comandos executados de verdade no repositório do front-end:

- `npm run typecheck` → exit 0, sem erros (inclui `react-router typegen` e `tsc`).
- `npm run build` → exit 0; build do cliente e do servidor concluídos, com 1058 módulos transformados no cliente e 216 no servidor.

Não foi afirmado nenhum resultado que não tenha sido medido.

## 7. Roteiro manual

1. Entrar como `ADMIN`, abrir a tela de auditoria e conferir que a coluna "Autor" mostra nome, papel e instituição gravados no log, e que a frase do evento usa o nome do autor.
2. Entrar como `MANAGER`: a lista deve continuar sem a coluna "IP" porque o back-end devolve `ip` nulo; os dados do autor devem aparecer normalmente.
3. Abrir o modal de detalhes de um evento: conferir "Autor", "Papel", "Instituição do autor" e "Autor (ID)" em fonte monoespaçada; "Endereço IP" só deve existir quando o back-end tiver enviado o valor.
4. Abrir a lista de administradores e a de membros da instituição: os e-mails devem chegar mascarados da API e o botão de olho deve estar presente ao lado de cada um.
5. Clicar no olho: o e-mail completo aparece, a requisição a `GET /api/v1/users/{id}/email` é feita e um evento `VIEW_EMAIL` passa a constar na auditoria. Clicar novamente para ocultar não deve gerar requisição nem novo log.
6. Provar um caso de erro (por exemplo, id sem permissão): o e-mail permanece mascarado e apenas o aviso do interceptor do axios aparece.
7. Conferir que a página de membros de uma turma continua sem o botão de olho, pois ficou fora do escopo.

## 8. Pendências

- Incluir filtros por nome/id e por intervalo de datas na consulta de logs.
- Levar o botão de olho às listas de turma e aos endpoints de escopo de turma.
- Registrar autoria em eventos de pré-autenticação, quando não há autor disponível.
- Registrar auditoria na abertura do modal de detalhes, se esse acesso precisar ser rastreado.
- Evoluir o texto dos eventos `UPDATE` para "antes → depois", além de tratar `ACCESS_DENIED`, exportação em CSV, retenção/expurgo e convites.
- Padronizar classe de exceção e causa raiz nos detalhes de falha.
- Corrigir o rótulo legado `LOGIN_SUCCESS)` e o comportamento do `fallbackExecution` apontados na auditoria anterior.
- Acompanhar, no back-end, a criação de uma migração versionada para as três colunas do autor caso o ambiente desative `ddl-auto=update`.

## 9. Commits sugeridos

1. `feat(audit-web): mostra o autor do log com nome e papel` — `app/types/audit.ts`, `app/utils/auditLabels.ts`, `app/components/organisms/AuditLogTable.tsx`, `app/components/organisms/AuditDetailsModal.tsx`.
2. `feat(users-web): botão de olho para mostrar o e-mail` — `app/api/users.ts`, `app/components/molecules/users/UserCard.tsx`, `app/pages/users/InstitutionUsersPage.tsx`, `app/pages/users/AdminUsersPage.tsx`.
3. `docs(audit): relatório da auditoria 2 no front-end` — `RELATORIO_AUDITORIA_2.md`.

O `RELATORIO_AUDITORIA.md` original não foi sobrescrito.
