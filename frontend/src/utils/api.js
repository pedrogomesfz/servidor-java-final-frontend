/**
 * Utilitários para fazer chamadas autenticadas à API
 */

const API_URL = import.meta.env.VITE_API_URL || "https://markeplace.onrender.com/api/v1";

/**
 * Faz uma chamada autenticada à API
 * @param {string} endpoint - O endpoint da API (sem a URL base)
 * @param {object} options - Opções do fetch (método, headers, body, etc)
 * @returns {Promise} Resposta da API
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Utilizador não autenticado. Por favor, faça login.");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se o token expirou, redirecionar para login
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erro ${response.status}: ${response.statusText}`
    );
  }

  return await response.json();
};

/**
 * GET - Obter dados
 */
export const apiGet = (endpoint) => {
  return apiCall(endpoint, { method: "GET" });
};

/**
 * POST - Criar dados
 */
export const apiPost = (endpoint, data) => {
  return apiCall(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT - Atualizar dados
 */
export const apiPut = (endpoint, data) => {
  return apiCall(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE - Apagar dados
 */
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, { method: "DELETE" });
};
