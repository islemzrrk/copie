const pool = require('../config/db');

// Profil complet : niveau (étudiant), niveaux et matières (enseignant).
const SELECT_USERS = `
  SELECT u.id, u.nom, u.email, u.role, u.statut, u.motif_refus, u.created_at,
         u.niveau_code, n.libelle AS niveau_libelle,
         COALESCE((
           SELECT json_agg(json_build_object('code', nv.code, 'libelle', nv.libelle) ORDER BY nv.ordre)
           FROM enseignant_niveaux en JOIN niveaux nv ON nv.code = en.niveau_code
           WHERE en.user_id = u.id
         ), '[]'::json) AS niveaux,
         COALESCE((
           SELECT json_agg(m.nom ORDER BY m.nom)
           FROM enseignant_matieres em JOIN matieres m ON m.id = em.matiere_id
           WHERE em.user_id = u.id
         ), '[]'::json) AS matieres
  FROM users u
  LEFT JOIN niveaux n ON n.code = u.niveau_code`;

function format(row) {
  const { niveau_code, niveau_libelle, ...rest } = row;
  return { ...rest, niveau: niveau_code ? { code: niveau_code, libelle: niveau_libelle } : null };
}

async function getProfile(id) {
  const result = await pool.query(`${SELECT_USERS} WHERE u.id = $1`, [id]);
  return result.rows[0] ? format(result.rows[0]) : null;
}

async function listByStatut(statut) {
  const result = await pool.query(
    `${SELECT_USERS} WHERE u.role <> 'admin' AND u.statut = $1 ORDER BY u.created_at DESC`,
    [statut]
  );
  return result.rows.map(format);
}

async function countByStatut() {
  const result = await pool.query(
    `SELECT statut, COUNT(*)::int AS total FROM users WHERE role <> 'admin' GROUP BY statut`
  );
  const counts = { en_attente: 0, valide: 0, refuse: 0 };
  result.rows.forEach((r) => { counts[r.statut] = r.total; });
  return counts;
}

module.exports = { getProfile, listByStatut, countByStatut };
