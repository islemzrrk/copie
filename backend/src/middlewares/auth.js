const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Verifie le jeton JWT (en-tete Authorization: Bearer <jeton>), puis relit le role
// et le statut en base : un compte refuse ou suspendu perd l'acces immediatement.
async function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Jeton invalide ou expiré.' });
  }

  try {
    const result = await pool.query('SELECT id, role, statut FROM users WHERE id = $1', [payload.id]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Compte introuvable.' });
    if (user.statut !== 'valide') {
      return res.status(403).json({ message: 'Votre compte n’est pas validé.' });
    }
    req.user = { id: user.id, role: user.role };
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
}

// Controle d'acces par role (cote serveur)
// Exemple : router.get('/admin', verifyToken, requireRole('admin'), handler)
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }
    return next();
  };
}

module.exports = { verifyToken, requireRole };
