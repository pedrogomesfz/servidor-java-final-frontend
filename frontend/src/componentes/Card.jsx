
function Card({ titulo, numero, descricao }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>

      <p className="numero">
        {numero}
      </p>

      <span>
        {descricao}
      </span>
    </div>
  );
}

export default Card;

