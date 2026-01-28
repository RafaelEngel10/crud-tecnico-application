import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PersonalAPP',
  password: 'senha',
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

// adicionar novo exercício
App.post('/exercicio/add', async (req, res) => {
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
      return res.status(400).json({ error: "Os campos id_treino e nome são obrigatórios." });
    }

    const sql = `
      INSERT INTO personal_app."Exercicio" (id_treino, nome, series, repeticoes, carga, descanso, ordem)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    const values = [
      id_treino,
      nome,
      series,
      repeticoes,
      carga,
      descanso,
      ordem
    ]

    const result = await query(sql, values)
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Erro ao criar aluno" })
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

App.get('/treinos/:id_treino', async (req, res) => {
  const { id_treino } = req.params

  try {
    const result = await query(`SELECT * FROM personal_app."Treino" WHERE id_treino = $1`, [id_treino])
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar treino' })
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

/*
  Retorna treino e todos os exercícios
*/
App.get('/treinos/:id/exercicio', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT 
        t.id_treino,
        t.nome_treino,
        t.data_criacao,
        t.observacoes,
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'id_exercicio', e.id_exercicio,
                'nome', e.nome,
                'series', e.series,
                'repeticoes', e.repeticoes,
                'carga', e.carga,
                'descanso', e.descanso,
                'ordem', e.ordem
              ) ORDER BY e.ordem
            ),
            '[]'::json
          )
          FROM personal_app."Exercicio" e
          WHERE e.id_treino = t.id_treino
        ) AS exercicios
      FROM personal_app."Treino" t
      WHERE t.id_treino = $1;
    `;

    const result = await query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Treino não encontrado" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar treino e exercícios" });
  }
});



// -- Método Update --
App.put("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  let { id_personal, nome, data_nascimento, peso, altura, objetivo } = req.body;

  try {
    data_nascimento = data_nascimento || null;
    peso = peso === "" ? null : peso;
    altura = altura === "" ? null : altura;
    nome = nome || null;
    objetivo = objetivo || null;
    id_personal = id_personal === "" ? null : id_personal;

    if (id_personal) {
      const personalCheck = await pool.query(
        `SELECT 1 FROM personal_app."Personal" WHERE id_personal = $1`,
        [id_personal]
      );
      if (personalCheck.rowCount === 0) {
        return res.status(400).json({ error: "Personal não existe." });
      }
    }

    const result = await pool.query(
      `UPDATE personal_app."Aluno"
       SET id_personal = COALESCE($1, id_personal),
           nome = COALESCE($2, nome),
           data_nascimento = COALESCE($3, data_nascimento),
           peso = COALESCE($4, peso),
           altura = COALESCE($5, altura),
           objetivo = COALESCE($6, objetivo)
       WHERE id_aluno = $7
       RETURNING *`,
      [id_personal, nome, data_nascimento, peso, altura, objetivo, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    res.json({ message: "Aluno atualizado com sucesso.", aluno: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar aluno." });
  }
});


App.put("/treino/:id", async (req, res) => {
  const { id } = req.params;
  const { nome_treino, data_criacao, observacoes } = req.body;

  try {
    const sql = `
      UPDATE personal_app."Treino"
      SET nome_treino = $1,
          data_criacao = $2,
          observacoes = $3,
      WHERE id_treino = $4
      RETURNING *
    `;

    const result = await query(sql, [nome_treino, data_criacao, observacoes, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Treino não encontrado." });
    }

    res.json({
      message: "Treino atualizado com sucesso.",
      treino: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar treino." });
  }
});

App.put("/exercicio/:id", async (req, res) => {
  const { id } = req.params
  const { nome, series, repeticoes, carga, descanso, ordem } = req.body

  try {
    const sql = `
      UPDATE personal_app."Exercicio"
      SET nome = $1,
          series = $2,
          repeticoes = $3,
          carga = $4,
          descanso = $5,
          ordem = $6
      WHERE id_exercicio = $7
      RETURNING *
    `

    const result = await query(sql, [nome, series, repeticoes, carga, descanso, ordem, id])
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Exercício não encontrado." });
    }

    res.json({
      message: "Exercício atualizado com sucesso.",
      treino: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar treino." });
  }
});


// -- Método Delete --
App.delete("/alunos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await query("BEGIN");

    await query(`
      DELETE FROM personal_app."Exercicio"
      WHERE id_treino IN (
        SELECT id_treino FROM personal_app."Treino"
        WHERE id_aluno = $1
      )
    `, [id]);

    await query(`
      DELETE FROM personal_app."Treino"
      WHERE id_aluno = $1
    `, [id]);

    const result = await query(`
      DELETE FROM personal_app."Aluno"
      WHERE id_aluno = $1
      RETURNING *
    `, [id]);

    if (result.rowCount === 0) {
      await query("ROLLBACK");
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    await query("COMMIT");

    res.json({
      message: "Aluno e todos os dados relacionados foram excluídos.",
      aluno: result.rows[0],
    });

  } catch (err) {
    await query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar aluno." });
  }
});

App.delete("/exercicio/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM personal_app."Exercicio" WHERE id_exercicio = $1 RETURNING *`,
    [id]
  );
  if (result.rowCount === 0)
    return res.status(404).json({ error: "Exercício não encontrado" });

  res.json({ message: "Exercício deletado" });
});

App.delete("/treinos/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("BEGIN");

  await pool.query(`DELETE FROM personal_app."Exercicio" WHERE id_treino = $1`, [id]);
  const treino = await pool.query(
    `DELETE FROM personal_app."Treino" WHERE id_treino = $1 RETURNING *`,
    [id]
  );

  if (treino.rowCount === 0) {
    await pool.query("ROLLBACK");
    return res.status(404).json({ error: "Treino não encontrado" });
  }

  await pool.query("COMMIT");
  res.json({ message: "Treino deletado com sucesso" });
});



App.listen(port, () => {
  console.log(`Rodando em http://localhost:${port}`)
})