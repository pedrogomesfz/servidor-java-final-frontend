
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

    if (!token) {
      setErro("Utilizador não autenticado. Por favor, faça login novamente.");
      setEnviando(false);
      return;
    }

    try {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/servicos`,
        {
          method: "POST",
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

      if (!resposta.ok) {
        if (resposta.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Erro ao criar serviço.");
      }

      setMensagem("Serviço criado com sucesso!");

      setTitulo("");
      setDescricao("");
      setPreco("");

      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível criar o serviço. Tente novamente.");
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

          {mensagem && <p className="sucesso" style={{ backgroundColor: "#e0ffe0", color: "#0a0", padding: "12px", borderRadius: "5px", marginBottom: "20px" }}>{mensagem}</p>}
          {erro && <p className="erro" style={{ backgroundColor: "#ffe0e0", color: "#c00", padding: "12px", borderRadius: "5px", marginBottom: "20px" }}>{erro}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titulo">Título *</label>
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
              <label htmlFor="descricao">Descrição *</label>
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

        <div>
          <label>Preço</label>
          <input
            type="number"
            placeholder="Ex: 5000"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            min="0"
            required
          />
        </div>

            <div className="form-actions">
              <button type="submit" disabled={enviando} className="btn-primary">
                {enviando ? "Criando..." : "Criar Serviço"}
              </button>
              <button type="button" onClick={handleCancel} disabled={enviando} className="btn-secondary">
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

