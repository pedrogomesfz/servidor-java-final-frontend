
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (resposta.ok) {
  const token = await resposta.text();

  localStorage.setItem("token", token);
  localStorage.setItem("username", username);

        setMensagem("✓ Login efetuado com sucesso!");

        // Redirecionar para dashboard após 1.5 segundos
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setErro("Username ou password incorretos.");
      }
    } catch (error) {
      console.error(error);
      setErro("Não foi possível ligar ao servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        <p>Entra na tua conta do Marketplace</p>

        {mensagem && <p className="sucesso" style={{ backgroundColor: "#e0ffe0", color: "#0a0", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>{mensagem}</p>}
        {erro && <p className="erro" style={{ backgroundColor: "#ffe0e0", color: "#c00", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>{erro}</p>}

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
            <label>Password</label>

            <input
              type="password"
              placeholder="Digite a sua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={enviando}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={enviando}>
            {enviando ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <div className="registar">
          <p>Ainda não tens conta?</p>

          <a href="/registo">
            Criar conta
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

