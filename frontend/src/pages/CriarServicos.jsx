import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CriarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagem("");
    setErro("");
    setEnviando(true);

    const token = localStorage.getItem("token");

    console.log("Token:", token);

    if (!token) {
      setErro("Utilizador não autenticado. Faça login novamente.");
      setEnviando(false);
      navigate("/login");
      return;
    }

    try {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/servicos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
          titulo,
          descricao,
          preco: Number(preco),
          precoComDesconto: 0,
          aplicarDescontoEmAtivos: 0

        }),
        }
      );

      console.log("Status:", resposta.status);

      if (!resposta.ok) {
        const textoErro = await resposta.text();
        console.error("Erro do servidor:", textoErro);

        if (resposta.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");

          setErro("Sessão expirada. Faça login novamente.");
          navigate("/login");
          return;
        }

        throw new Error(
          textoErro || "Erro ao criar serviço."
        );
      }

      setMensagem("Serviço criado com sucesso!");

      setTitulo("");
      setDescricao("");
      setPreco("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Erro:", error);
      setErro(
        error.message || "Não foi possível criar o serviço."
      );
    } finally {
      setEnviando(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="criar-servico">
      <div className="container">
        <div className="criar-servico-card">

          <h1>Criar Novo Serviço</h1>

          {mensagem && (
            <p
              className="sucesso"
              style={{
                backgroundColor: "#e0ffe0",
                color: "#0a0",
                padding: "12px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              {mensagem}
            </p>
          )}

          {erro && (
            <p
              className="erro"
              style={{
                backgroundColor: "#ffe0e0",
                color: "#c00",
                padding: "12px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              {erro}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="titulo">
                Título *
              </label>

              <input
                id="titulo"
                type="text"
                placeholder="Ex: Desenvolvimento de Website"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                disabled={enviando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">
                Descrição *
              </label>

              <textarea
                id="descricao"
                placeholder="Descreva o serviço em detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows="6"
                disabled={enviando}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preco">
                Preço *
              </label>

              <input
                id="preco"
                type="number"
                placeholder="Ex: 5000"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                min="0"
                required
                disabled={enviando}
              />
            </div>

            <div className="form-actions">

              <button
                type="submit"
                disabled={enviando}
                className="btn-primary"
              >
                {enviando
                  ? "Criando..."
                  : "Criar Serviço"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={enviando}
                className="btn-secondary"
              >
                Cancelar
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CriarServico;