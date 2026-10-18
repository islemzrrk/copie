const pool = require('../config/db');
const { getProfile, listByStatut, countByStatut } = require('../lib/userQueries');

const STATUTS = ['en_attente', 'valide', 'refuse'];

// GET /api/admin/users?statut=en_attente|valide|refuse
async function listUsers(req, res) {
  try {
    const statut = req.query.statut || 'en_attente';
    if (!STATUTS.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }
    const [users, counts] = await Promise.all([listByStatut(statut), countByStatut()]);
    return res.json({ users, counts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// PATCH /api/admin/users/:id/statut  { statut: 'valide' | 'refuse', motif?: string }
async function setStatut(req, res) {
  try {
    const id = Number(req.params.id);
    const { statut, motif } = req.body || {};

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Identifiant invalide.' });
    }
    if (!['valide', 'refuse'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide (valide ou refuse).' });
    }

    const cleanMotif =
      statut === 'refuse' && typeof motif === 'string' && motif.trim() ? motif.trim().slice(0, 300) : null;

    const result = await pool.query(
      `UPDATE users SET statut = $1, motif_refus = $2, statut_modifie_le = NOW()
       WHERE id = $3 AND role <> 'admin'
       RETURNING id`,
      [statut, cleanMotif, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable (ou compte administrateur).' });
    }
    return res.json(await getProfile(id));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

module.exports = { listUsers, setStatut };
