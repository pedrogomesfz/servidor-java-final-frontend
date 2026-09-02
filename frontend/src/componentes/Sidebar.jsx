
function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("meu_token");
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <h2>Marketplace</h2>

      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/servicos">Serviços</a>
        <a href="/criar-servico">Criar Serviço</a>
        <a href="/meuperfil">Meu Perfil</a>
      </nav>

      <button onClick={handleLogout}>
        Sair
      </button>
    </aside>
  );
}

export default Sidebar;


