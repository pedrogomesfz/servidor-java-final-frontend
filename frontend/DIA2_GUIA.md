# Dia 2: O Coração do Marketplace (Dados e Interface)

## 📋 Resumo das Tarefas Implementadas

Com o utilizador autenticado no Dia 1, o Dia 2 é dedicado a consumir a API para ler e enviar dados (CRUD básico).

---

## 1️⃣ Listar os Serviços (GET) - Dashboard

### O que foi feito:
- ✅ Página Dashboard criada para listar serviços paginados
- ✅ Consumo de API com token de autenticação
- ✅ Paginação de serviços
- ✅ Estados de carregamento e erro

### Como funciona:

```javascript
// No Dashboard.jsx
const carregarServicos = async (pagina = 0) => {
  const token = localStorage.getItem("token");  // 🔑 Pegamos no token guardado!

  const resposta = await fetch(
    `${import.meta.env.VITE_API_URL}/servicos?page=${pagina}&size=10`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,  // 🎫 O passaporte aqui!
        "Content-Type": "application/json"
      },
    }
  );

  const dados = await resposta.json();
  setServicos(dados.content);  // Renderizar a lista
};
```

### ⚙️ Configuração da variável de ambiente:

**Ficheiro: `.env`**
```
VITE_API_URL=https://markeplace.onrender.com/api/v1
```

### 📱 Como usar em React:
```javascript
// Aceder à variável de ambiente
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 2️⃣ Injetar o Token nos Pedidos (Bearer Token)

### ✨ Opção A: Método Manual (Como aprender)

```javascript
const meuFetch = async (url, opcoes = {}) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.log("Utilizador não autenticado!");
    return;
  }

  const headers = {
    ...opcoes.headers,
    "Authorization": `Bearer ${token}`,  // ← A chave!
    "Content-Type": "application/json"
  };

  const resposta = await fetch(url, {
    ...opcoes,
    headers
  });

  return resposta;
};

// Usar:
const dados = await meuFetch(`${API_URL}/servicos`);
```

### ✨ Opção B: Usando Utilitário (Recomendado)

Existe um ficheiro `src/utils/api.js` com funções prontas:

```javascript
import { apiGet, apiPost, apiDelete } from "@/utils/api";

// GET - Obter serviços
const servicos = await apiGet("/servicos?page=0&size=10");

// POST - Criar serviço
const novoServico = await apiPost("/servicos", {
  titulo: "Meu Serviço",
  descricao: "...",
  preco: 500
});

// DELETE - Apagar serviço
await apiDelete("/servicos/123");
```

---

## 3️⃣ Criar um Serviço (POST)

### O que foi feito:
- ✅ Formulário em `CriarServicos.jsx`
- ✅ Validação de dados
- ✅ Envio com token de autenticação
- ✅ Mensagens de sucesso/erro
- ✅ Redirecionamento após criação

### Como funciona:

```javascript
// src/pages/CriarServicos.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const token = localStorage.getItem("token");

  const resposta = await fetch(
    `${import.meta.env.VITE_API_URL}/servicos`,
    {
      method: "POST",  // ← POST para criar
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: titulo,
        descricao: descricao,
        preco: Number(preco),
      }),
    }
  );

  if (resposta.ok) {
    console.log("✓ Serviço criado com sucesso!");
    navigate("/dashboard");  // Ir para dashboard
  }
};
```

---

## 4️⃣ Logout (Remover Token)

### O que foi feito:
- ✅ Botão "Sair" no Dashboard
- ✅ Limpeza do localStorage
- ✅ Redirecionamento para Login

### Como funciona:

```javascript
const handleLogout = () => {
  // Remover dados guardados
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  // Redirecionar para login
  window.location.href = "/login";
};
```

---

## 📊 Fluxo Completo da Autenticação

```
┌─────────────┐
│   Login     │  → localStorage.setItem("token", dados.token)
└─────────────┘
       ↓
┌─────────────────────────────┐
│   Dashboard                 │  → GET /servicos com token
│   (Lista Serviços)          │
└─────────────────────────────┘
       ↓
┌─────────────────────────────┐
│   CriarServicos             │  → POST /servicos com token
│   (Criar novo Serviço)      │
└─────────────────────────────┘
       ↓
┌─────────────┐
│   Logout    │  → localStorage.removeItem("token")
└─────────────┘
       ↓
    Login
```

---

## 🔒 Rotas Protegidas

Ficheiro: `src/App.jsx`

```javascript
import ProtectedRoute from "./componentes/ProtectedRoute";

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

O componente `ProtectedRoute` verifica se existe token. Se não existir, redireciona para `/login`.

---

## 📁 Estrutura de Ficheiros Criada/Modificada

```
frontend/
├── .env                           ← Configuração da API
├── .env.example                   ← Template do .env
├── src/
│   ├── App.jsx                    ← Rotas protegidas adicionadas
│   ├── utils/
│   │   └── api.js                 ← NOVO: Utilitários de API
│   ├── componentes/
│   │   └── ProtectedRoute.jsx     ← Atualizado: token correto
│   └── pages/
│       ├── Dashboard.jsx          ← Atualizado: GET /servicos
│       ├── CriarServicos.jsx      ← Atualizado: POST /servicos
│       ├── Login.jsx              ← Atualizado: Armazena username
│       └── Registo.jsx
```

---

## 🧪 Como Testar

### 1. Faça Login
- Aceda a `http://localhost:5173/login`
- Use credenciais válidas
- Token é guardado em `localStorage`

### 2. Veja o Dashboard
- A página `/dashboard` carrega os serviços da API
- Verifique na aba Network do browser se o header `Authorization` está presente

### 3. Crie um Serviço
- Clique em "+ Novo Serviço"
- Preencha o formulário
- Clique em "Criar Serviço"
- Deve redirecionar para Dashboard

### 4. Faça Logout
- Clique no botão "Sair"
- Token é removido
- Redirecionado para Login

---

## ⚠️ Verificar a API URL

Se receber erro de conexão, verifique:

1. O ficheiro `.env` tem `VITE_API_URL` correto?
2. O servidor backend está ativo?
3. Os headers `Authorization` e `Content-Type` estão corretos?

Verifique na aba **Network** do DevTools:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Conceitos Principais Aprendidos

| Conceito | Descrição |
|----------|-----------|
| **Bearer Token** | Método de autenticação usando `Authorization: Bearer <token>` |
| **localStorage** | Armazenamento no cliente para guardar token e dados |
| **CRUD** | Create (POST), Read (GET), Update (PUT), Delete (DELETE) |
| **Paginação** | Dividir resultados em páginas (page=0&size=10) |
| **Rotas Protegidas** | Verificar autenticação antes de aceder |
| **VITE_API_URL** | Variável de ambiente para endpoint da API |

---

## 📚 Referências

- [MDN - Fetch API](https://developer.mozilla.org/pt-PT/docs/Web/API/Fetch_API)
- [MDN - LocalStorage](https://developer.mozilla.org/pt-PT/docs/Web/API/Window/localStorage)
- [React Router - Rotas Protegidas](https://reactrouter.com/en/main)
- [JWT - Bearer Token](https://tools.ietf.org/html/rfc6750)

---

**Dia 3**: Vamos adicionar mais funcionalidades como editar, apagar serviços e filtros avançados! 🚀
