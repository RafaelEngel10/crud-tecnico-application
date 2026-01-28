import { useState } from "react";

export function AlunoForm() {
    const [form, setForm] = useState({
    id_personal: "",
    nome: "",
    data_nascimento: "",
    peso: "",
    altura: "",
    objetivo: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3003/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      setMensagem("Aluno cadastrado com sucesso!");
      setForm({ id_personal: "", nome: "", data_nascimento: "", peso: "", altura: "", objetivo: "" });

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Cadastrar Aluno</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_personal"
          placeholder="Id do Personal"
          value={form.id_personal}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="data_nascimento"
          placeholder="Data de Nascimento"
          value={form.data_nascimento}
          onChange={handleChange}
        />

        <input
          type="text"
          name="peso"
          placeholder="Peso em Kilos (Kg)"
          value={form.peso}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="altura"
          placeholder="Altura em metros (m)"
          value={form.altura}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="objetivo"
          placeholder="Objetivo do aluno"
          value={form.objetivo}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>

      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}