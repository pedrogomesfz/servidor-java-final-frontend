
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Registo() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagem("");
    setErro("");
    setEnviando(true);

    try {
      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
          }),
        }
      );

      if (resposta.ok) {
        setMensagem("✓ Registo efetuado com sucesso! Redirecionando para login...");
        setUsername("");
        setPassword("");
        setEmail("");

        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.message || "Erro ao efetuar o registo.");
      }
    } catch (error) {
      console.error(error);
      setErro("Não foi possível ligar ao servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="registo-container">
      <div className="registo-card">
        <h1>Criar Conta</h1>
        <p>Regista-te no Marketplace</p>

        {mensagem && <p className="sucesso" style={{ backgroundColor: "#e0ffe0", color: "#0a0", padding: "15px", borderRadius: "5px", marginBottom: "15px" }}>{mensagem}</p>}
        {erro && <p className="erro" style={{ backgroundColor: "#ffe0e0", color: "#c00", padding: "15px", borderRadius: "5px", marginBottom: "15px" }}>{erro}</p>}

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Username</label>
            <input
                type="text"
                placeholder="Digite o seu username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={enviando}
                autoComplete="username"
              />
          </div>

          <div className="campo">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={enviando}
              autoComplete="email"
              />
          </div>

          <div className="campo">
            <label>Password</label>
            <input
              type="password"
              placeholder="Digite a sua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={enviando}
              autoComplete="new-password"
              />
          </div>

          <button type="submit" disabled={enviando}>
            {enviando ? "A registar..." : "Registar"}
          </button>
        </form>

        <div className="login">
          <p>Já tens conta?</p>
          <a href="/login">
            Fazer login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Registo;