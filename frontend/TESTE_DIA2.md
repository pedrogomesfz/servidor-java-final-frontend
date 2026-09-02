# 🧪 Guia de Teste - Dia 2

## ✅ Pré-requisitos

- [x] Backend está ativo em `https://markeplace.onrender.com`
- [x] Ficheiro `.env` configurado com `VITE_API_URL`
- [x] Aplicação React em execução (`npm run dev`)
- [x] DevTools do navegador abertos (F12)

---

## 🔍 Cenários de Teste

### Teste 1: Login com sucesso
**Passo a passo:**
1. Aceda a `http://localhost:5173/login`
2. Insira credenciais válidas (ex: username="usuario", password="senha")
3. Clique em "Entrar"

**Validações:**
- ✅ Vê mensagem "Login efetuado com sucesso!"
- ✅ Redirecionado para `/dashboard` após 1.5 segundos
- ✅ No DevTools → Application → localStorage → existe `token` e `username`

```javascript
// Console: Verifique o token
console.log(localStorage.getItem("token"));
```

---

### Teste 2: Listar Serviços (GET com token)
**Passo a passo:**
1. Após login, está no Dashboard
2. Observe a seção "Serviços Disponíveis"

**Validações:**
- ✅ Lista de serviços carregada
- ✅ Cada serviço mostra: título, descrição, preço
- ✅ Se houver muitos serviços, vê botões "Anterior" e "Próxima"

**Verificar na aba Network:**
1. DevTools → Network
2. Procure por requisição `servicos?page=0&size=10`
3. Clique nela e vá a Headers
4. Verifique:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Teste 3: Paginação
**Passo a passo:**
1. No Dashboard, se houver múltiplas páginas
2. Clique no botão "Próxima →"

**Validações:**
- ✅ Lista muda para a próxima página
- ✅ Contador mostra "Página 2 de X"
- ✅ Botão "Anterior" fica ativo

**DevTools:**
```
GET /servicos?page=1&size=10  ← Note o page=1
```

---

### Teste 4: Criar Serviço (POST com token)
**Passo a passo:**
1. No Dashboard, clique em "+ Novo Serviço"
2. Vá para a página `/criarservicos`
3. Preencha o formulário:
   - Título: "Website para Café"
   - Descrição: "Desenvolvimento completo de website responsivo"
   - Preço: "1500"
4. Clique em "Criar Serviço"

**Validações:**
- ✅ Vê estado "Criando..." no botão
- ✅ Mensagem "Serviço criado com sucesso!"
- ✅ Redirecionado para Dashboard após 2 segundos
- ✅ Novo serviço aparece na lista

**DevTools - Network:**
```
POST /servicos
Headers:
  Authorization: Bearer ...
  Content-Type: application/json

Body (JSON):
{
  "titulo": "Website para Café",
  "descricao": "Desenvolvimento completo de website responsivo",
  "preco": 1500
}
```

---

### Teste 5: Logout
**Passo a passo:**
1. No Dashboard, clique em botão "Sair"
2. Verifique redirecionamento para `/login`

**Validações:**
- ✅ Redirecionado para login
- ✅ No localStorage: `token` e `username` foram removidos
- ✅ Se tentar aceder diretamente a `/dashboard`, redirecionado para login

**Console:**
```javascript
console.log(localStorage.getItem("token")); // null
console.log(localStorage.getItem("username")); // null
```

---

### Teste 6: Rotas Protegidas
**Passo a passo:**
1. Faça logout (token removido)
2. Na barra de endereço, tente aceder a `http://localhost:5173/dashboard`

**Validações:**
- ✅ Redirecionado automaticamente para `/login`
- ⚠️ Não consegue aceder sem token

**Código verificado:**
```javascript
// ProtectedRoute.jsx valida isto
const token = localStorage.getItem("token");
if (!token) window.location.href = "/login";
```

---

### Teste 7: Erro 401 (Token Expirado)
**Passo a passo:**
1. Faça login (token guardado)
2. Abra DevTools → Storage → localStorage
3. Mude o valor do token para algo inválido
4. Tente recarregar a página ou clicar em "Próxima"

**Validações:**
- ✅ Recebe erro 401
- ✅ Token é removido do localStorage
- ✅ Redirecionado para login

---

### Teste 8: Validação de Formulário
**Passo a passo:**
1. Vá a `/criarservicos`
2. Tente submeter sem preencher campos
3. Ou tente com preço negativo

**Validações:**
- ✅ Validação HTML5 (required, min)
- ✅ Campos desabilitados enquanto enviando
- ✅ Não pode submeter vazio

---

### Teste 9: Variáveis de Ambiente
**Passo a passo:**
1. Verifique ficheiro `.env`:
   ```
   VITE_API_URL=https://markeplace.onrender.com/api/v1
   ```

**Validações:**
- ✅ Acesse em código: `import.meta.env.VITE_API_URL`
- ✅ Deve conter o URL correto

**Console:**
```javascript
console.log(import.meta.env.VITE_API_URL);
// Output: https://markeplace.onrender.com/api/v1
```

---

### Teste 10: Registo
**Passo a passo:**
1. Aceda a `/registo`
2. Preencha o formulário:
   - Username: "novoutilizador"
   - Email: "novo@exemplo.com"
   - Password: "senha123"
3. Clique em "Registar"

**Validações:**
- ✅ Se sucesso: "Registo efetuado com sucesso!"
- ✅ Redirecionado para login após 2 segundos
- ✅ Se erro: mensagem clara do servidor

---

## 📊 Checklist de Implementação

| Funcionalidade | Arquivo | Status |
|---|---|---|
| Login com token | Login.jsx | ✅ |
| Armazenar username | Login.jsx | ✅ |
| Listar serviços | Dashboard.jsx | ✅ |
| Paginação | Dashboard.jsx | ✅ |
| Injetar Bearer token | Todos | ✅ |
| Criar serviço | CriarServicos.jsx | ✅ |
| Logout | Dashboard.jsx | ✅ |
| Rotas protegidas | App.jsx | ✅ |
| Variáveis de ambiente | .env | ✅ |
| Tratamento de erros | Todas as páginas | ✅ |

---

## 🐛 Troubleshooting

### Problema: "Não foi possível carregar os serviços"
**Soluções:**
1. Verifique se backend está ativo
2. Confirme `VITE_API_URL` em `.env`
3. Verifique se token é válido
4. Abra DevTools → Network e veja a resposta do servidor

```javascript
// Debug no console
const token = localStorage.getItem("token");
console.log("Token:", token);
console.log("API URL:", import.meta.env.VITE_API_URL);
```

### Problema: "Erro 401 - Unauthorized"
**Soluções:**
1. Token expirou → Faça login novamente
2. Token malformado → Limpe localStorage e faça login
3. Verificar header `Authorization: Bearer ...`

```javascript
// Console
localStorage.removeItem("token");
localStorage.removeItem("username");
// Depois faça login novamente
```

### Problema: Redirecionamento infinito
**Soluções:**
1. Verifique se ProtectedRoute está funcionar
2. Certifique-se que token existe após login
3. Verifique console para erros

### Problema: Variável de ambiente retorna undefined
**Soluções:**
1. Ficheiro `.env` deve estar na raiz do projeto (frontend/)
2. Variável deve começar com `VITE_`
3. Reinicie o servidor (`npm run dev`)

---

## 📱 Exemplo de Requisição com cURL

Testar a API direto com cURL (sem React):

```bash
# Login
curl -X POST https://markeplace.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"usuario","password":"senha"}'

# Resultado:
# {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# Listar serviços (substitua TOKEN)
curl -X GET "https://markeplace.onrender.com/api/v1/servicos?page=0&size=10" \
  -H "Authorization: Bearer TOKEN"

# Criar serviço
curl -X POST https://markeplace.onrender.com/api/v1/servicos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "titulo":"Novo Serviço",
    "descricao":"Descrição",
    "preco":500
  }'
```

---

## 📚 Recursos Úteis

- [DevTools - Network Tab](https://developer.chrome.com/docs/devtools/network/)
- [DevTools - Storage/localStorage](https://developer.chrome.com/docs/devtools/storage/)
- [Fetch API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Bearer Token - RFC 6750](https://tools.ietf.org/html/rfc6750)

---

**✨ Testes completos = Implementação bem-sucedida! 🚀**
