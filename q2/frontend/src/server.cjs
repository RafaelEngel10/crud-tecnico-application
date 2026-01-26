require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get("/", (req, res) => {
  res.json({ status: "API com Supabase rodando 🚀" });
});


// ================= PERSONAL =================
app.post("/personais", async (req, res) => {
  const { data, error } = await supabase.from("personal").insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get("/personais", async (req, res) => {
  const { data, error } = await supabase.from("personal").select("*");
  if (error) return res.status(400).json(error);
  res.json(data);
});


// ================= ALUNOS =================
app.post("/alunos", async (req, res) => {
  const { data, error } = await supabase.from("aluno").insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get("/personais/:id/alunos", async (req, res) => {
  const { data, error } = await supabase
    .from("aluno")
    .select("*")
    .eq("id_personal", req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.put("/alunos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("aluno")
    .update(req.body)
    .eq("id_aluno", req.params.id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.delete("/alunos/:id", async (req, res) => {
  const { error } = await supabase.from("aluno").delete().eq("id_aluno", req.params.id);
  if (error) return res.status(400).json(error);
  res.json({ message: "Aluno deletado" });
});


// ================= TREINOS =================
app.post("/treinos", async (req, res) => {
  const { data, error } = await supabase.from("treino").insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get("/alunos/:id/treinos", async (req, res) => {
  const { data, error } = await supabase
    .from("treino")
    .select("*")
    .eq("id_aluno", req.params.id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.put("/treinos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("treino")
    .update(req.body)
    .eq("id_treino", req.params.id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.delete("/treinos/:id", async (req, res) => {
  const { error } = await supabase.from("treino").delete().eq("id_treino", req.params.id);
  if (error) return res.status(400).json(error);
  res.json({ message: "Treino deletado" });
});


app.post("/exercicios", async (req, res) => {
  const { data, error } = await supabase.from("exercicio").insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get("/treinos/:id/exercicios", async (req, res) => {
  const { data, error } = await supabase
    .from("exercicio")
    .select("*")
    .eq("id_treino", req.params.id)
    .order("ordem", { ascending: true });

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.put("/exercicios/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("exercicio")
    .update(req.body)
    .eq("id_exercicio", req.params.id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.delete("/exercicios/:id", async (req, res) => {
  const { error } = await supabase.from("exercicio").delete().eq("id_exercicio", req.params.id);
  if (error) return res.status(400).json(error);
  res.json({ message: "Exercício deletado" });
});


// ================= START =================
app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT}`);
});