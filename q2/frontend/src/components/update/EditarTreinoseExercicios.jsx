import { useState } from "react";

export function EditarTreinoeExercicio() {
  const [id_treino, setIdTreino] = useState("");
  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [form, setForm] = useState({
    id_treino: id_treino,
    nome: "",
    series: "",
    repeticoes: "",
    carga: "",
    descanso: "",
    ordem: ""
  });


  async function buscarTreino() {
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3003/treinos/${id_treino}/exercicio`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao buscar treino");

      setTreino(data.treino || data);
      setExercicios(data.exercicios || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  function adicionarExercicio() {
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
        const element = document.getElementById('adicionar-exercicio');
        const button = document.getElementById('add-new-ex');

        if (element.style.display === 'none') {
            element.style.display = 'block';
            button.style.display = 'none';
        } else {
            element.style.display = 'none';
            button.style.display = 'block';
        }
    } catch (err) {
        setErro(err.message);
    } finally {
        setLoading(false);
    }
  }

  function handleTreinoChange(e) {
    setTreino({ ...treino, [e.target.name]: e.target.value });
  }

  function handleExercicioChange(index, campo, valor) {
    const lista = [...exercicios];
    lista[index][campo] = valor;
    setExercicios(lista);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvarAlteracoes() {
    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      await fetch(`http://localhost:3003/treinos/${id_treino}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(treino)
      });

      for (const ex of exercicios) {
        await fetch(`http://localhost:3003/exercicio/${ex.id_exercicio}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ex)
        });
      }

      setMensagem("Treino e exercícios atualizados com sucesso!");
    } catch (err) {
      setErro("Erro ao salvar alterações");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setLoading(true);

    if (!form.id_treino) {
        console.log('ID do Treino vazio.');
        form.id_treino = id_treino;
    }

    try {
        const response = await fetch(`http://localhost:3003/exercicio/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erro ao adicionar exercicio");
        }

        console.log("Sucesso:", data);
    } catch (err) {
        console.error("Erro:", err.message);
    } finally {
        setLoading(false);
    }
   }

  return (
    <div className="result-section-page">
        <div>
            <div className="result-child-div">
                <h2>Editar Treino</h2>

                <input
                    type="number"
                    placeholder="ID do Treino"
                    value={id_treino}
                    onChange={(e) => setIdTreino(e.target.value)}
                />
                <button onClick={buscarTreino}>Buscar</button>
            </div>

            {treino && (
                <>
                <h3>Dados do Treino</h3>
                <input
                    name="nome_treino"
                    value={treino.nome_treino || ""}
                    onChange={handleTreinoChange}
                />
                <input
                    type="date"
                    name="data_criacao"
                    value={treino.data_criacao?.split("T")[0] || ""}
                    onChange={handleTreinoChange}
                />
                <input
                    name="observacoes"
                    value={treino.observacoes || ""}
                    onChange={handleTreinoChange}
                />

                <h3>Exercícios</h3>
                <div className="results-section">
                    {exercicios.length === 0 ? (
                        <p style={{ color: "gray" }}>
                        Este treino não possui exercícios cadastrados.
                        </p>
                    ) : (
                        exercicios.map((ex, i) => (
                        <div className="results-ex" key={ex.id_exercicio} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
                            <input
                            value={ex.nome || ""}
                            onChange={(e) => handleExercicioChange(i, "nome", e.target.value)}
                            />
                            <input
                            type="number"
                            value={ex.series || ""}
                            onChange={(e) => handleExercicioChange(i, "series", e.target.value)}
                            />
                            <input
                            type="number"
                            value={ex.repeticoes || ""}
                            onChange={(e) => handleExercicioChange(i, "repeticoes", e.target.value)}
                            />
                            <input
                            type="number"
                            value={ex.carga || ""}
                            onChange={(e) => handleExercicioChange(i, "carga", e.target.value)}
                            />
                            <input
                            type="number"
                            value={ex.descanso || ""}
                            onChange={(e) => handleExercicioChange(i, "descanso", e.target.value)}
                            />
                            <input
                            type="number"
                            value={ex.ordem || ""}
                            onChange={(e) => handleExercicioChange(i, "ordem", e.target.value)}
                            />
                        </div>
                        ))
                    )}
                    <div className="div-add-ex">
                        <button id="add-new-ex" type="button" onClick={() => adicionarExercicio()}>
                            + Adicionar novo Exercicio
                        </button>
                        <div id="adicionar-exercicio" style={{ display: 'none' }}>
                            <form onSubmit={handleSubmit} className="new-form-section">
                                <input 
                                type="text"
                                name="nome"
                                value={form.nome}
                                placeholder="Nome do exercicio"
                                onChange={handleChange}
                                />

                                <input 
                                type="number"
                                name="series"
                                value={form.series}
                                placeholder="Series de exercicios"
                                onChange={handleChange}
                                />

                                <input 
                                type="number"
                                name="repeticoes"
                                value={form.repeticoes}
                                placeholder="Repeticoes de exercicios"
                                onChange={handleChange}
                                />

                                <input 
                                type="number"
                                name="carga"
                                value={form.carga}
                                placeholder="Carga em Kilos (Kgs)"
                                onChange={handleChange}
                                />

                                <input 
                                type="number"
                                name="descanso"
                                value={form.descanso}
                                placeholder="Descanso em segundos"
                                onChange={handleChange}
                                />

                                <input 
                                type="number"
                                name="ordem"
                                value={form.ordem}
                                placeholder="Ordem dos exercicios"
                                onChange={handleChange}
                                />

                                <button type="submit" disabled={loading}>
                                    {loading ? "Adicionando..." : "Adicionar"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>


                {exercicios.length > 0 && (
                    <button onClick={salvarAlteracoes} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                )}
                </>
            )}

            {erro && <p style={{ color: "red" }}>{erro}</p>}
            {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        </div>
    </div>
  );
}
