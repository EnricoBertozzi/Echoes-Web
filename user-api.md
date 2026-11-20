# API do Usuário Autenticado

Documentação dos endpoints de **usuário autenticado** do Echoes Server.

Essa API é consumida pela dashboard do usuário autenticado. As rotas de
autenticação e de gerenciamento de contas por perfil (`ADMIN`, `MANAGER`,
`TEACHER` e `STUDENT`) ficam em outros documentos, como
[`admin-animal-api.md`](./admin-animal-api.md).

## Base URL

```text
http://localhost:8080
```

ou o valor configurado em `SERVER_PORT`.

## Autenticação

Todos os endpoints desta API exigem um token JWT válido.

Fluxo resumido:

1. `POST /api/v1/auth/login` com e-mail e senha.
2. `POST /api/v1/auth/mfa` com o código enviado por e-mail/SMS.
3. Utilizar o token retornado em `Authorization: Bearer <token>`.

## Endpoints

| Método | Rota | Permissão | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | Autenticado | Retorna os dados do usuário autenticado |
| `PATCH` | `/api/v1/users/me` | Autenticado | Atualiza nome e e-mail do usuário autenticado |
| `PATCH` | `/api/v1/auth/password/change` | Autenticado | Altera a senha do usuário autenticado |
| `DELETE` | `/api/v1/users/me` | Autenticado | Remove logicamente o usuário autenticado |

---

## 1. GET /api/v1/users/me

Retorna os dados do usuário autenticado.

### Requisição

```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

### Resposta `200 OK`

```json
{
  "id": "9f2c1d3e-4b5a-6c7d-8e9f-0a1b2c3d4e5f",
  "name": "João Silva",
  "email": "joao@example.com",
  "institutionId": "0b7b2f6e-7a49-4a5f-9c1e-2d3a4b5c6d7e",
  "role": "MANAGER"
}
```

### Erros comuns

| Status | Quando ocorre |
|---|---|
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário autenticado não encontrado |

---

## 2. PATCH /api/v1/users/me

Atualiza os dados básicos do usuário autenticado.

### Requisição

```http
PATCH /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json
```

### Corpo da requisição

```json
{
  "name": "João Silva Atualizado",
  "email": "joao.silva@novo-email.com"
}
```

### Campos

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | `string` | Novo nome do usuário. Opcional no DTO, mas não pode ficar em branco. |
| `email` | `string` | Novo e-mail do usuário. Opcional no DTO, mas deve ser um e-mail válido. |

Regras:

- Apenas os campos não nulos são alterados.
- O e-mail é normalizado (trim + lowercase).
- O e-mail é validado para não estar em uso por outro usuário.
- O e-mail atual pode ser mantido sem acionar a checagem de disponibilidade.

### Resposta `200 OK`

Retorna o `UserDTO` atualizado.

```json
{
  "id": "9f2c1d3e-4b5a-6c7d-8e9f-0a1b2c3d4e5f",
  "name": "João Silva Atualizado",
  "email": "joao.silva@novo-email.com",
  "institutionId": "0b7b2f6e-7a49-4a5f-9c1e-2d3a4b5c6d7e",
  "role": "MANAGER"
}
```

### Exemplo com `curl`

```bash
curl -X PATCH http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.silva@novo-email.com"
  }'
```

### Erros comuns

| Status | Quando ocorre |
|---|---|
| `400` | JSON malformado, DTO inválido ou e-mail inválido |
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário autenticado não encontrado |
| `409` | E-mail já cadastrado para outro usuário |

---

## 3. PATCH /api/v1/auth/password/change

Altera a senha do usuário autenticado.

### Requisição

```http
PATCH /api/v1/auth/password/change
Authorization: Bearer <token>
Content-Type: application/json
```

### Corpo da requisição

```json
{
  "currentPassword": "senhaAtual",
  "newPassword": "novaSenha123"
}
```

### Campos

| Campo | Tipo | Descrição |
|---|---|---|
| `currentPassword` | `string` | Senha atual do usuário. Obrigatória. |
| `newPassword` | `string` | Nova senha do usuário. Obrigatória. |

Regras:

- A senha atual é obrigatória.
- A nova senha é obrigatória.
- A senha atual é validada pelo `PasswordEncoder`.
- Após a alteração bem-sucedida, as tentativas de login são reiniciadas.

### Resposta `200 OK`

Retorna corpo vazio.

### Exemplo com `curl`

```bash
curl -X PATCH http://localhost:8080/api/v1/auth/password/change \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "senhaAtual",
    "newPassword": "novaSenha123"
  }'
```

### Erros comuns

| Status | Quando ocorre |
|---|---|
| `400` | JSON malformado, DTO inválido ou senha atual incorreta |
| `401` | Token ausente, inválido ou expirado |
| `403` | Usuário bloqueado |
| `404` | Usuário autenticado não encontrado |

---

## 4. DELETE /api/v1/users/me

Remove logicamente o usuário autenticado.

A exclusão é **lógica**: o campo `active` do usuário é definido como `false`, e os vínculos com turmas são removidos.

A remoção também aplica **anonimização** nos dados pessoais do usuário, alterando nome, e-mail, senha, tentativas de login, bloqueio e, quando aplicável, instituição. O e-mail é substituído por um valor anonimado e único, permitindo que um novo usuário utilize o e-mail anterior.

### Requisição

```http
DELETE /api/v1/users/me
Authorization: Bearer <token>
```

### Resposta

`204 No Content`

### Erros comuns

| Status | Quando ocorre |
|---|---|
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário autenticado não encontrado |
| `409` | Último gestor da instituição tenta se excluir |

Regra:

- Um `MANAGER` que seja o último gestor ativo da instituição não pode se excluir.
- Demais perfis não possuem essa restrição de último gestor.

### Exemplo com `curl`

```bash
curl -X DELETE http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <token>"
```

---

## 4. DTOs

### UserDTO

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `UUID` | Identificador do usuário |
| `name` | `string` | Nome do usuário |
| `email` | `string` | E-mail do usuário |
| `institutionId` | `UUID` | Identificador da instituição; nulo para perfis sem instituição |
| `role` | `enum` | Papel do usuário: `ADMIN`, `MANAGER`, `TEACHER` ou `STUDENT` |

### UpdateUserDTO

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | `string` | Novo nome do usuário |
| `email` | `string` | Novo e-mail do usuário |

### ChangePasswordRequest

| Campo | Tipo | Descrição |
|---|---|---|
| `currentPassword` | `string` | Senha atual do usuário |
| `newPassword` | `string` | Nova senha do usuário |

---

## 5. Fluxo resumido

1. Autenticar o usuário em `/api/v1/auth/login` e `/api/v1/auth/mfa`.
2. Usar o token em `/api/v1/users/me`.
3. Para editar perfil, usar `PATCH /api/v1/users/me`.
4. Para alterar senha, usar `PATCH /api/v1/auth/password/change`.
5. Para excluir conta, usar `DELETE /api/v1/users/me`.

## 6. Observações

- Os endpoints de usuário autenticado exigem autenticação.
- A exclusão é lógica e remove os vínculos com turmas.
- A atualização não altera a instituição do usuário; para mudanças de vínculo/instituição, utilizam-se os endpoints administrativos.
