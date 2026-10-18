const pool = require('../config/db');

// GET /api/reference : niveaux et matieres proposes a l'inscription (public)
async function getReference(req, res) {
  try {
    const [niveaux, matieres] = await Promise.all([
      pool.query('SELECT code, libelle FROM niveaux ORDER BY ordre'),
      pool.query('SELECT id, nom FROM matieres ORDER BY nom'),
    ]);
    return res.json({ niveaux: niveaux.rows, matieres: matieres.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

module.exports = { getReference };
