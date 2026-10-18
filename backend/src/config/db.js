require('dotenv').config();
const { Pool } = require('pg');

// La connexion n'est ouverte qu'au premier appel de requete.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
