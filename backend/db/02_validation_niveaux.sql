-- Mise à jour : niveaux, matières et validation des comptes par un administrateur.
-- A executer dans la base quiz_platform (peut être relancé sans risque).

-- 1. Référentiels
CREATE TABLE IF NOT EXISTS niveaux (
  code    VARCHAR(20) PRIMARY KEY,
  libelle VARCHAR(50) NOT NULL,
  ordre   INTEGER NOT NULL
);

INSERT INTO niveaux (code, libelle, ordre) VALUES
  ('lycee_1',   'Lycée – 1ère année', 1),
  ('lycee_2',   'Lycée – 2ème année', 2),
  ('lycee_3',   'Lycée – 3ème année', 3),
  ('lycee_bac', 'Lycée – Bac',        4),
  ('fac',       'Faculté',            5)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS matieres (
  id  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom VARCHAR(80) NOT NULL UNIQUE
);

-- Pour ajouter une matière plus tard : INSERT INTO matieres (nom) VALUES ('Ma matière');
INSERT INTO matieres (nom) VALUES
  ('Mathématiques'),
  ('Sciences physiques'),
  ('Sciences de la vie et de la Terre'),
  ('Informatique'),
  ('Arabe'),
  ('Français'),
  ('Anglais'),
  ('Histoire-Géographie'),
  ('Philosophie'),
  ('Économie et gestion')
ON CONFLICT (nom) DO NOTHING;

-- 2. Statut du compte : les comptes déjà créés deviennent « valide »,
--    les nouveaux seront « en_attente » jusqu'à la décision d'un administrateur.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'statut'
  ) THEN
    ALTER TABLE users
      ADD COLUMN statut VARCHAR(15) NOT NULL DEFAULT 'valide'
      CHECK (statut IN ('en_attente', 'valide', 'refuse'));
    ALTER TABLE users ALTER COLUMN statut SET DEFAULT 'en_attente';
  END IF;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS motif_refus TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS statut_modifie_le TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS niveau_code VARCHAR(20) REFERENCES niveaux(code);

-- 3. Ce qu'un enseignant enseigne
CREATE TABLE IF NOT EXISTS enseignant_niveaux (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  niveau_code VARCHAR(20) NOT NULL REFERENCES niveaux(code),
  PRIMARY KEY (user_id, niveau_code)
);

CREATE TABLE IF NOT EXISTS enseignant_matieres (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matiere_id INTEGER NOT NULL REFERENCES matieres(id),
  PRIMARY KEY (user_id, matiere_id)
);
