import { useState } from 'react'

export function TreinoForm() {
  const [etapa, setEtapa] = useState(1);

  const [treino, setTreino] = useState({
    id_aluno: "",
    nome_treino: "",
    data_criacao: "",
    observacoes: "",
  });

  const [exercicioAtual, setExercicioAtual] = useState({
    id_treino: "",
    nome: "",
    series: "",
    repeticoes: "",
    carga: "",
    descanso: "",
    ordem: ""
  });

  const [exercicios, setExercicios] = useState([]);

  function handleTreinoChange(e) {
    setTreino({ ...treino, [e.target.name]: e.target.value });
  }

  function handleExercicioChange(e) {
    setExercicioAtual({ ...exercicioAtual, [e.target.name]: e.target.value });
  }

  function salvarTreino(e) {
    e.preventDefault();
    if (!treino.nome_treino) return alert("Dê um nome ao treino");
    setEtapa(2);
  }

  function adicionarExercicio(e) {
    e.preventDefault();
    if (!exercicioAtual.nome) return;

    setExercicios([...exercicios, exercicioAtual]);
    setExercicioAtual({ id_treino: "", nome: "", series: "", repeticoes: "", carga: "", descanso: "", ordem: "" });
  }

  async function finalizarCadastro() {
    const payload = {
      treino,
      exercicios,
    };

    setLoading(true);
    try {
      if (!treino.id_aluno || !treino.nome_treino) {
        throw new Error("Preencha aluno e nome do treino.");
      }
      if (exercicios.length === 0) {
        throw new Error("Adicione pelo menos um exercício.");
      }
      const payload = {
        ...treino,
        exercicios
      };
      const response = await fetch("http://localhost:3003/treino-exercicio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar treino");
      }
      setMensagem("Treino e exercícios cadastrados com sucesso!");
      // Limpa formulário
      setTreino({
        id_aluno: "",
        nome_treino: "",
        data_criacao: "",
        observacoes: ""
      });
      setExercicios([]);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Cadastro de Treino</h2>

      {etapa === 1 && (
        <form onSubmit={salvarTreino}>
          <input
            type="number"
            name="id_aluno"
            placeholder="ID do Aluno"
            value={treino.id_aluno}
            onChange={handleTreinoChange}
          />

          <input
            type="text"
            name="nome_treino"
            placeholder="Nome do treino"
            value={treino.nome_treino}
            onChange={handleTreinoChange}
          />

          <input
            type="date"
            name="data_criacao"
            placeholder="Data de Criação"
            value={treino.data_criacao}
            onChange={handleTreinoChange}
          />

          <input
            type="text"
            name="observacoes"
            placeholder="Observações do personal"
            value={treino.observacoes}
            onChange={handleTreinoChange}
          />
          
          <div style={{ display: "flex", justifyContent: "center"}}>
            <button type="submit">Salvar Treino e Adicionar Exercícios</button>
          </div>
        </form>
      )}

      {etapa === 2 && (
        <>
          <h3>Treino: {treino.nome}</h3>

          <form onSubmit={adicionarExercicio}>
            <input
              type="text"
              name="nome"
              placeholder="Nome do exercício"
              value={exercicioAtual.nome}
              onChange={handleExercicioChange}
            />

            <input
              type="number"
              name="series"
              placeholder="Séries"
              value={exercicioAtual.series}
              onChange={handleExercicioChange}
            />

            <input
              type="number"
              name="repeticoes"
              placeholder="Repetições"
              value={exercicioAtual.repeticoes}
              onChange={handleExercicioChange}
            />

            <input
              type="number"
              name="carga"
              placeholder="Carga (kg)"
              value={exercicioAtual.carga}
              onChange={handleExercicioChange}
            />

            <input
              type="number"
              name="descanso"
              placeholder="Segundos de Descanso"
              value={exercicioAtual.descanso}
              onChange={handleExercicioChange}
            />

            <input
              type="number"
              name="ordem"
              placeholder="Ordem de Contagem"
              value={exercicioAtual.ordem}
              onChange={handleExercicioChange}
            />

            <button type="submit">Adicionar Exercício</button>
          </form>

          <h4 style={{ color: "rgb(204, 204, 204)" }}>Exercícios adicionados</h4>
          <ul>
            {exercicios.map((ex, i) => (
              <li key={i}>
                {ex.nome} — {ex.series}x{ex.repeticoes} ({ex.carga}kg)
              </li>
            ))}
          </ul>

          <button onClick={finalizarCadastro} disabled={exercicios.length === 0}>
            Finalizar Cadastro do Treino
          </button>
        </>
      )}
    </div>
  );
}
