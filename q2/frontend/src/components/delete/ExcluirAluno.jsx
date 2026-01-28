import { useState } from "react";


export function ExcluirAluno() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [alunos, setAlunos] = useState([]);

    const [form, setForm] = useState({
        id_aluno: ""
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setMensagem("");
        setAlunos([]);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3003/alunos/${form.id_aluno}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao excluir aluno");
            }

            setAlunos(data);
            setMensagem("Aluno excluído com sucesso.");
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Excluir Aluno</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="id_aluno"
                    placeholder="ID do Aluno"
                    value={form.id_aluno}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Excluindo..." : "Excluir"}
                </button>
            </form>

            {erro && <p style={{ color: "red" }}>{erro}</p>}
            {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        </div>
    );
}