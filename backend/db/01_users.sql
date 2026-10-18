-- Sprint 1 : table des utilisateurs
-- A executer dans la base quiz_platform

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom           VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL
                CHECK (role IN ('etudiant', 'enseignant', 'admin')),
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
