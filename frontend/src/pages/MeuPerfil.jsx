
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MeuPerfil() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
    const utilizadorGuardado = localStorage.getItem("username");
    const emailGuardado = localStorage.getItem("email");

    if (!utilizadorGuardado) {
        navigate("/login");
        return;
    }

    setUsername(utilizadorGuardado);
    setEmail(emailGuardado || "Email não disponível");
    }, [navigate]);

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    navigate("/login");
    };

    return (
    <div className="perfil-page">

      {/* MENU LATERAL */}
        <aside className="sidebar">

        <h2>Marketplace</h2>

        <nav>
            <a href="/dashboard">Dashboard</a>
            <a href="/criarservicos">Criar Serviço</a>
            <a href="/perfil" className="ativo">
            Meu Perfil
            </a>
        </nav>

        <button
            onClick={handleLogout}
            className="btn-logout"
        >
            Sair
        </button>

        </aside>

      {/* CONTEÚDO */}
        <main className="perfil-conteudo">

        <header className="perfil-topo">
            <div>
            <h1>Meu Perfil</h1>
            <p>Consulte as informações da sua conta.</p>
            </div>
        </header>

        {/* CARTÃO DO PERFIL */}
        <section className="perfil-card">

            <div className="perfil-avatar">
            {username
                ? username.charAt(0).toUpperCase()
                : "U"}
            </div>

          <h2>{username || "Utilizador"}</h2>

          <p className="perfil-tipo">
            Utilizador do Marketplace
          </p>

          <div className="perfil-info">

            <div className="info-item">
              <span>👤</span>

              <div>
                <label>Nome de utilizador</label>
                <p>{username || "Não disponível"}</p>
              </div>
            </div>

            <div className="info-item">
              <span>📧</span>

              <div>
                <label>Email</label>
                <p>{email}</p>
              </div>
            </div>

            <div className="info-item">
              <span>🔐</span>

              <div>
                <label>Estado da conta</label>
                <p className="conta-ativa">
                  ● Conta ativa
                </p>
              </div>
            </div>

          </div>

          <div className="perfil-acoes">

            <button
              className="btn-voltar"
              onClick={() => navigate("/dashboard")}
            >
              ← Voltar ao Dashboard
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default MeuPerfil;

