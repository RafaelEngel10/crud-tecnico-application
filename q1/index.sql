-- TABELA Personal
CREATE TABLE Personal (
    id_personal      SERIAL PRIMARY KEY,               -- ID do personal
    nome             VARCHAR(100) NOT NULL,             -- Nome do personal
    email            VARCHAR(150) UNIQUE NOT NULL,       -- Opções de 
    telefone         VARCHAR(20),                        --          Contato
    registro_prof    VARCHAR(20) UNIQUE NOT NULL        -- Registro Profissional
);


-- TABELA ALUNO
CREATE TABLE Aluno (
    id_aluno         SERIAL PRIMARY KEY,                -- ID do aluno
    id_personal      INT NOT NULL,                       -- Chave estrangeira (ID do personal)
    nome             VARCHAR(100) NOT NULL,              -- Nome do aluno
    data_nascimento  DATE,                               -- Data de nascimento do aluno
    peso             DECIMAL(5,2),                       -- Peso do aluno                          
    altura           DECIMAL(4,2),                       -- Altura do aluno 
    objetivo         TEXT,                                -- Objetivo do aluno (Ex: emagrecimento, hipertrofia)

    CONSTRAINT fk_aluno_personal FOREIGN KEY (id_personal)
        REFERENCES Personal(id_personal)
        ON DELETE CASCADE
);


-- TABELA TREINO
CREATE TABLE Treino (
    id_treino        SERIAL PRIMARY KEY,                -- ID do treino
    id_aluno         INT NOT NULL,                      -- Chave estrangeira (ID do aluno) 
    nome_treino      VARCHAR(100) NOT NULL,             -- Nome do treino (Ex: Treino º1 - Peito)     
    data_criacao     DATE DEFAULT CURRENT_DATE,         -- Quando foi montado
    observacoes      TEXT,                              -- Observações ou notas do personal

    CONSTRAINT fk_treino_aluno FOREIGN KEY (id_aluno)
        REFERENCES Aluno(id_aluno)
        ON DELETE CASCADE
);


-- TABELA EXERCICIO
CREATE TABLE Exercicio (
    id_exercicio     SERIAL PRIMARY KEY,                -- ID do exercícios
    id_treino        INT NOT NULL,                      -- Chave estrangeira (ID do treino) 
    nome             VARCHAR(120) NOT NULL,             -- Nome do exercício (Ex: Supino Reto)
    series           INT,                                -- Número de séries    
    repeticoes       VARCHAR(20),                        -- Número de repetições (Ex: 8-10)
    carga            VARCHAR(20),                        -- Carga em Kgs (Ex: 20Kgs)
    descanso         VARCHAR(20),                       -- Tempo de Descanço (Ex: 60s)
    ordem            INT,                                -- Ordem do exercício no treino

    CONSTRAINT fk_exercicio_treino FOREIGN KEY (id_treino)
        REFERENCES Treino(id_treino)
        ON DELETE CASCADE
);
