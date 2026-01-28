import { useState } from "react";

export function ExcluirTreinoExercicio() {
  const [idTreino, setIdTreino] = useState("");
  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function buscarTreino() {
  setErro("");
  setMensagem("");
  setLoading(true);

  try {
    const res = await fetch(`http://localhost:3003/treinos/${idTreino}/exercicio`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erro ao buscar treino");

    setTreino({
      id_treino: data.id_treino,
      nome_treino: data.nome_treino,
      data_criacao: data.data_criacao,
      observacoes: data.observacoes
    });

    setExercicios(data.exercicios || []);

  } catch (err) {
    setErro(err.message);
    setTreino(null);
    setExercicios([]);
  } finally {
    setLoading(false);
  }
}

  async function deletarExercicio(id_exercicio) {

    try {
      const res = await fetch(`http://localhost:3003/exercicio/${id_exercicio}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setExercicios(exercicios.filter(ex => ex.id_exercicio !== id_exercicio));
      setMensagem("Exercício excluído com sucesso!");
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarTreino() {

    try {
      const res = await fetch(`http://localhost:3003/treinos/${idTreino}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTreino(null);
      setExercicios([]);
      setMensagem("Treino excluído com sucesso!");
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="result-section-page">
      <h2>Excluir Treino / Exercícios</h2>

      <input
        type="number"
        placeholder="ID do Treino"
        value={idTreino}
        onChange={(e) => setIdTreino(e.target.value)}
      />
      <button onClick={buscarTreino} disabled={loading}>
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {treino && (
        <>
          <h3>Treino: {treino.nome_treino}</h3>
          <p><b>Data:</b> {treino.data_criacao?.split("T")[0]}</p>
          <p><b>Observações:</b> {treino.observacoes}</p>

          <h3>Exercícios</h3>
          {exercicios.length === 0 ? (
            <p style={{ color: "gray" }}>Este treino não possui exercícios.</p>
          ) : (
            <div className="results-section">
              {exercicios.map((ex) => (
                <div key={ex.id_exercicio} className="results-ex" style={{ border: "1px solid #ccc", padding: 10 }}>
                  <p><b>{ex.nome}</b></p>
                  <p>{ex.series}x{ex.repeticoes} • {ex.carga}kg</p>
                  <button onClick={() => deletarExercicio(ex.id_exercicio)}>
                    Excluir Exercício
                  </button>
                </div>
              ))}
            </div>
          )}

          <hr style={{ margin: "20px 0" }} />

          <button onClick={deletarTreino} style={{ border: "1px #8d8d8d solid" }}>
            Excluir Treino Completo
          </button>
        </>
      )}

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {mensagem && <p style={{ color: "lightgreen" }}>{mensagem}</p>}
    </div>
  );
}