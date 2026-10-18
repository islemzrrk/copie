const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Un compte administrateur ne peut pas etre cree depuis l'inscription publique.
const SELF_REGISTER_ROLES = ['etudiant', 'enseignant'];
const uniq = (list) => [...new Set(list)];

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET manquant dans le fichier .env');
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });
}

function publicUser(row) {
  return { id: row.id, nom: row.nom, email: row.email, role: row.role, statut: row.statut };
}

// POST /api/auth/register
// Etudiant : { niveau: 'lycee_1' | 'lycee_2' | 'lycee_3' | 'lycee_bac' | 'fac' }
// Enseignant : { niveaux: [codes], matieres: [ids] } (au moins un de chaque)
// Le compte est cree « en_attente » : un administrateur doit le valider.
async function register(req, res) {
  try {
    const { nom, email, mot_de_passe, role, niveau } = req.body || {};

    if (!nom || !email || !mot_de_passe || !role) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Adresse e-mail invalide.' });
    }
    if (mot_de_passe.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }
    if (!SELF_REGISTER_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide (etudiant ou enseignant).' });
    }

    let niveauCode = null;
    let niveauxList = [];
    let matieresList = [];

    if (role === 'etudiant') {
      if (!niveau || typeof niveau !== 'string') {
        return res.status(400).json({ message: 'Choisissez votre niveau : lycée (avec l’année) ou faculté.' });
      }
      niveauCode = niveau;
    } else {
      const rawNiveaux = Array.isArray(req.body.niveaux) ? req.body.niveaux : [];
      const rawMatieres = Array.isArray(req.body.matieres) ? req.body.matieres : [];
      niveauxList = uniq(rawNiveaux.filter((x) => typeof x === 'string'));
      matieresList = uniq(rawMatieres.map(Number).filter(Number.isInteger));
      if (matieresList.length === 0) {
        return res.status(400).json({ message: 'Choisissez au moins une matière.' });
      }
      if (niveauxList.length === 0) {
        return res.status(400).json({ message: 'Choisissez au moins un niveau.' });
      }
    }

    // Les niveaux et matieres doivent exister en base.
    const codes = role === 'etudiant' ? [niveauCode] : niveauxList;
    const knownCodes = await pool.query('SELECT code FROM niveaux WHERE code = ANY($1::varchar[])', [codes]);
    if (knownCodes.rowCount !== codes.length) {
      return res.status(400).json({ message: 'Niveau invalide.' });
    }
    if (role === 'enseignant') {
      const knownMatieres = await pool.query('SELECT id FROM matieres WHERE id = ANY($1::int[])', [matieresList]);
      if (knownMatieres.rowCount !== matieresList.length) {
        return res.status(400).json({ message: 'Matière invalide.' });
      }
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const inserted = await client.query(
        `INSERT INTO users (nom, email, mot_de_passe, role, niveau_code)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nom, email, role, statut`,
        [nom.trim(), email.trim().toLowerCase(), hash, role, niveauCode]
      );
      const user = inserted.rows[0];

      if (role === 'enseignant') {
        await client.query(
          'INSERT INTO enseignant_niveaux (user_id, niveau_code) SELECT $1::int, UNNEST($2::varchar[])',
          [user.id, niveauxList]
        );
        await client.query(
          'INSERT INTO enseignant_matieres (user_id, matiere_id) SELECT $1::int, UNNEST($2::int[])',
          [user.id, matieresList]
        );
      }

      await client.query('COMMIT');
      return res.status(201).json({
        message: 'Inscription reçue. Votre compte sera activé après validation par un administrateur.',
        user: publicUser(user),
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, mot_de_passe } = req.body || {};

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'E-mail et mot de passe obligatoires.' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email.trim().toLowerCase(),
    ]);
    const user = result.rows[0];

    // Meme message dans les deux cas pour ne pas reveler si l'e-mail existe.
    const ok = user && (await bcrypt.compare(mot_de_passe, user.mot_de_passe));
    if (!ok) {
      return res.status(401).json({ message: 'E-mail ou mot de passe incorrect.' });
    }

    if (user.statut === 'en_attente') {
      return res.status(403).json({
        statut: user.statut,
        message: 'Votre compte est en attente de validation par un administrateur.',
      });
    }
    if (user.statut === 'refuse') {
      const motif = user.motif_refus ? ` Motif : ${user.motif_refus}` : '';
      return res.status(403).json({
        statut: user.statut,
        message: `Votre inscription a été refusée.${motif}`,
      });
    }

    return res.json({ user: publicUser(user), token: signToken(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

module.exports = { register, login };
