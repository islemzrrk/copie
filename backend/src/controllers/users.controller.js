const pool = require('../config/db');
const { getProfile } = require('../lib/userQueries');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/users/me
async function getMe(req, res) {
  try {
    const profile = await getProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// PUT /api/users/me  (nom et e-mail modifiables ; le role ne l'est pas)
async function updateMe(req, res) {
  try {
    const { nom, email } = req.body || {};

    if (!nom || !email) {
      return res.status(400).json({ message: 'Nom et e-mail obligatoires.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Adresse e-mail invalide.' });
    }

    const result = await pool.query(
      'UPDATE users SET nom = $1, email = $2 WHERE id = $3 RETURNING id',
      [nom.trim(), email.trim().toLowerCase(), req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    return res.json(await getProfile(req.user.id));
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

module.exports = { getMe, updateMe };
