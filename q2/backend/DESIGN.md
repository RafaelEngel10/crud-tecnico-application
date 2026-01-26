# CREATE 
<pre>
1. <b>Cadastro de profissional:</b>

    - Endpoint:
    POST /personais

    - Body em JSON:
    {
        "nome": "João Pedro Martins",
        "email": "joaopedromartins03@fit.com.br",
        "telefone": "359999911111",
        "registro_prof": "123456-G/MG"
    }

    - Consulta em SQL:
    INSERT INTO Personal (nome, email, telefone, registro_prof)
    VALUES ('João Pedro Martins', 'joaopedromartins03@fit.com.br', '359999911111', '123456-G/MG');

2. <b>Cadastro de alunos:</b>

    - Endpoint:
    POST /alunos

    - Body em JSON:
    {
        "id_personal": 1,
        "nome": "Carlos Souza",
        "data_nascimento": "1998-05-10",
        "peso": 82.5,
        "altura": 1.78,
        "objetivo": "Hipertrofia"
    }

    - Consulta em SQL:
    INSERT INTO aluno (id_personal, nome, data_nascimento, peso, altura, objetivo)
    VALUES (1, 'Carlos Souza', '1998-05-10', 82.5, 1.78, 'Hipertrofia');

3. <b>Cadastro de treinos:</b>

    - Endpoint:
    POST /treinos

    - Body em JSON:
    {
        "id_aluno": 3,
        "nome_treino": "Treino A - Peito",
        "observacoes": "Foco em carga progressiva"
    }

    - Consulta em SQL:
    INSERT INTO treino (id_aluno, nome_treino, observacoes)
    VALUES (3, 'Treino A - Peito', 'Foco em carga progressiva');

4. <b>Cadastro de exercícios:</b>

    - Endpoint:
    POST /exercicios

    - Body em JSON:
    {
        "id_treino": 10,
        "nome": "Supino Reto",
        "series": 4,
        "repeticoes": "8-10",
        "carga": "40kg",
        "descanso": "60s",
        "ordem": 1
    }

    - Consulta em SQL:
    INSERT INTO exercicio (id_treino, nome, series, repeticoes, carga, descanso, ordem)
    VALUES (10, 'Supino Reto', 4, '8-10', '40kg', '60s', 1);
</pre>

# READ
<pre>
<b>.1: Listar alunos de um personal</b>
- Endpoint:
    GET /personais/1/alunos

- Consulta em SQL:
    SELECT * FROM aluno 
    WHERE id_personal = 1;


<b>.2: Ver treinos de um aluno</b>
- Endpoint:
    GET /alunos/3/treinos

- Consulta em SQL:
    SELECT * FROM treino
    WHERE id_aluno = 3;


<b>.3: Ver exercícios de um treino</b>
- Endpoint:
    GET treinos/10/exercicios

- Consulta em SQL:
    SELECT * FROM exercicio
    WHERE id_treino = 10
    ORDER BY ordem;
</pre>

# UPDATE
<pre>
<b>.1: Atualizar dados de um aluno</b>
- Endpoint: 
    PUT /alunos/3

- Body em JSON:
    {
        "peso": 80.0,
        "objetivo": "Definição"
    }

- Consulta em SQL:
    UPDATE aluno 
        SET peso = 80.0,
        objetivo = 'Definição'
    WHERE id_aluno = 3;
    
</pre>