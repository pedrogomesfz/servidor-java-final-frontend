
import { useEffect, useState } from "react";


function Dashboard() {
  const [username, setUsername] = useState("");
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    // Recuperar o utilizador guardado no login
    const utilizadorGuardado = localStorage.getItem("username");

    if (utilizadorGuardado) {
      setUsername(utilizadorGuardado);
    }

    // Carregar serviços da API
    carregarServicos(paginaAtual);
  }, []);

  const carregarServicos = async (pagina = 0) => {
    const token = localStorage.getItem("token");

    console.log(token);
    
/*
    if (!token) {
      setErro("Utilizador não autenticado.");
      window.location.href = "/login";
      return;
    }*/

    try {
      setCarregando(true);
      setErro("");

      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/servicos`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!resposta.ok) {
        /*if (resposta.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }*/
        throw new Error("Erro ao carregar serviços.");
      }

      const dados = await resposta.json();
      setServicos(dados.content || []);
      setTotalPaginas(dados.totalPages || 1);
      setPaginaAtual(pagina);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os serviços.");
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "/login";
  };

  return (
    <div className="dashboard">

      {/* MENU LATERAL */}
      <aside className="sidebar">
        <h2>Marketplace</h2>

        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/criarservicos">Criar Serviço</a>
          <a href="/perfil">Meu Perfil</a>
        </nav>

        <button onClick={handleLogout} className="btn-logout">
          Sair
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="conteudo">

        <header className="topo">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo de volta, {username || "utilizador"}!</p>
          </div>
          <button onClick={() => window.location.href = "/criarservicos"} className="btn-novo">
            + Novo Serviço
          </button>
        </header>

        {/* MENSAGENS */}
        {erro && <p className="erro" style={{ padding: "10px", backgroundColor: "#ffe0e0", color: "#c00", borderRadius: "5px", marginBottom: "20px" }}>{erro}</p>}

        {/* LISTA DE SERVIÇOS */}
        <section className="servicos">
          <h2>Serviços Disponíveis</h2>

          {carregando ? (
            <p style={{ textAlign: "center", padding: "20px" }}>Carregando serviços...</p>
          ) : servicos.length > 0 ? (
            <>
              <div className="servicos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {servicos.map((servico) => (
                  <div key={servico.id} className="servico-card" style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h3>{servico.titulo}</h3>
                    <p className="descricao" style={{ color: "#666", marginBottom: "10px" }}>{servico.descricao}</p>
                    <p className="preco" style={{ fontSize: "18px", fontWeight: "bold", color: "#2196F3", marginBottom: "10px" }}>
                      {servico.preco ? `${servico.preco.toFixed(2)}€` : "Consultar"}
                    </p>
                    <small style={{ color: "#999" }}>ID: {servico.id}</small>
                  </div>
                ))}
              </div>

              {/* PAGINAÇÃO */}
              {totalPaginas > 1 && (
                <div className="paginacao" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                  <button 
                    onClick={() => carregarServicos(paginaAtual - 1)} 
                    disabled={paginaAtual === 0}
                    style={{ padding: "8px 15px", cursor: paginaAtual === 0 ? "not-allowed" : "pointer", opacity: paginaAtual === 0 ? 0.5 : 1 }}
                  >
                    ← Anterior
                  </button>
                  <span style={{ padding: "8px 15px" }}>Página {paginaAtual + 1} de {totalPaginas}</span>
                  <button 
                    onClick={() => carregarServicos(paginaAtual + 1)} 
                    disabled={paginaAtual >= totalPaginas - 1}
                    style={{ padding: "8px 15px", cursor: paginaAtual >= totalPaginas - 1 ? "not-allowed" : "pointer", opacity: paginaAtual >= totalPaginas - 1 ? 0.5 : 1 }}
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ textAlign: "center", padding: "20px", color: "#999" }}>Nenhum serviço disponível no momento.</p>
          )}
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
