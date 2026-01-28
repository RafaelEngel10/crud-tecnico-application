import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PersonalAPP',
  password: 'lokomaqueloko12',
  port: 5432,
})

dotenv.config();
const App = express();
const port = 3003

App.use(cors());
App.use(express.json());

async function query(text, params) {
  const res = await pool.query(text, params)
  return res
}

// -- Método Create --
App.post("/personal", async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      registro_prof
    } = req.body

    if (!nome || !registro_prof) {
        return res.status(400).json({ error: "Os campos nome e registro_prof são obrigatórios." })
    }

    const sql = `
        INSERT INTO personal_app."Personal" (nome, email, telefone, registro_prof)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const values = [
      nome,
      email || null,
      telefone || null,
      registro_prof
    ]

    const result = await query(sql, values);
    res.status(201).json(result.rows[0]);


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao criar personal" })
  }
})

App.post("/alunos", async (req, res) => {
  try {
    const {
      id_personal,
      nome,
      data_nascimento,
      peso,
      altura,
      objetivo
    } = req.body

    if (!id_personal || !nome) {
      return res.status(400).json({ error: "Os campos id_personal e nome são obrigatórios." });
    }

    const sql = `
      INSERT INTO personal_app."Aluno" (id_personal, nome, data_nascimento, peso, altura, objetivo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    const values = [
      id_personal,
      nome,
      data_nascimento || null,
      peso || null,
      altura || null,
      objetivo || null
    ]

    const result = await query(sql, values)
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao criar aluno" })
  }
})

App.post('/treinos', async (req, res) => {
  try {
      const {
        id_aluno,
        nome_treino,
        data_criacao,
        observacoes
      } = req.body

      if (!id_aluno || !nome_treino) {
        return res.status(400).json({ error: "Os campos id_aluno e nome_treino são obrigatórios." });
      }
      const sql = `
        INSERT INTO personal_app."Treino" (id_aluno, nome_treino, data_criacao, observacoes)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [
        id_aluno,
        nome_treino,
        data_criacao || null,
        observacoes || null
      ];

      const result = await query(sql, values);
      res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar treino' })
  }
})

App.post('/exercicios', async (req, res) => {
  try {
    const {
      id_treino,
      nome,
      series,
      repeticoes,
      carga,
      descanso,
      ordem
    } = req.body

    if (!id_treino || !nome) {
      return res.status(400).json({ error: "O campo nome é obrigatório." });
    }

    const sql = `
      INSERT INTO personal_app."Exercicio" (id_treino, nome, series, repeticoes, carga, descanso, ordem)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      id_treino,
      nome,
      series || null,
      repeticoes || null,
      carga || null,
      descanso || null,
      ordem || null
    ]

    const result = await query(sql, values);
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar treino' })
  }
})

// Método de inserção de treino com exercícios
App.post('/treino-exercicio', async (req, res) => {
  const client = await pool.connect(); // usa o mesmo client na transação

  try {
    const {
      id_aluno,
      nome_treino,
      data_criacao,
      observacoes,
      exercicios
    } = req.body;

    if (!id_aluno || !nome_treino) {
      return res.status(400).json({ error: "Os campos id_aluno e nome_treino são obrigatórios." });
    }

    if (!Array.isArray(exercicios) || exercicios.length === 0) {
      return res.status(400).json({ error: "O treino deve ter pelo menos um exercício." });
    }

    await client.query('BEGIN');

    const treinoSQL = `
      INSERT INTO personal_app."Treino"
      (id_aluno, nome_treino, data_criacao, observacoes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const treinoValues = [
      id_aluno,
      nome_treino,
      data_criacao || null,
      observacoes || null
    ];

    const treinoResult = await client.query(treinoSQL, treinoValues);
    const treinoCriado = treinoResult.rows[0];

    // inserção dos exercícios
    const exerciciosInseridos = [];

    for (const ex of exercicios) {
      if (!ex.nome) {
        throw new Error("Todo exercício precisa ter nome.");
      }

      const exercicioSQL = `
        INSERT INTO personal_app."Exercicio"
        (id_treino, nome, series, repeticoes, carga, descanso, ordem)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const exercicioValues = [
        treinoCriado.id_treino,
        ex.nome,
        ex.series || null,
        ex.repeticoes || null,
        ex.carga || null,
        ex.descanso || null,
        ex.ordem || null
      ];

      const exercicioResult = await client.query(exercicioSQL, exercicioValues);
      exerciciosInseridos.push(exercicioResult.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      treino: treinoCriado,
      exercicios: exerciciosInseridos
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar treino com exercícios' });
  } finally {
    client.release();
  }
});



// -- Método Read --
App.get('/personal/:id_personal/alunos', async (req, res) => {
  const { id_personal } = req.params

  try {
    const result = await pool.query(
      'SELECT * FROM personal_app."Aluno" WHERE id_personal = $1',
      [id_personal]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar alunos' })
  }
})

App.get('/alunos/:id_aluno/treinos', async (req, res) => {
  const { id_aluno } = req.params

  try {
    const result = await pool.query(
      'SELECT * FROM personal_app."Treino" WHERE id_aluno = $1',
      [id_aluno]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar treinos' })
  }
})

App.get('/treinos/:id_treino/exercicios', async (req, res) => {
  const { id_treino } = req.params

  try {
    const result = await pool.query(
      'SELECT * FROM personal_app."Exercicio" WHERE id_treino = $1',
      [id_treino]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar exercícios' })
  }
})

/* 
  Buscar aluno específico
*/
App.get('/alunos/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'SELECT * FROM personal_app."Aluno" WHERE id_aluno = $1',
      [id]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Aluno não encontrado' })

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar aluno' })
  }
})

/* 
  Buscar personal específico
*/
App.get('/personal/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await query('SELECT * FROM personal_app."Personal" WHERE id_personal = $1', [id])

    if (result.rows.length === 0) return res.status(404).json({ error: 'Personal não encontrado' });
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar personal' })
  }
})



// -- Método Delete --


App.listen(port, () => {
  console.log(`Rodando em http://localhost:${port}`)
})