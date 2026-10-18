const request = require('supertest');
const app = require('../src/app');

const base = { nom: 'Test', email: 'test@exemple.com', mot_de_passe: 'motdepasse123' };

describe('API', () => {
  test('GET /api/health renvoie ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/users/me sans jeton renvoie 401', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/register avec données manquantes renvoie 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  test('Inscription étudiant sans niveau renvoie 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...base, role: 'etudiant' });
    expect(res.statusCode).toBe(400);
  });

  test('Inscription enseignant sans matière renvoie 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...base, role: 'enseignant', niveaux: ['fac'], matieres: [] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/matière/);
  });

  test('Inscription enseignant sans niveau renvoie 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...base, role: 'enseignant', niveaux: [], matieres: [1] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/niveau/);
  });

  test('Inscription avec le rôle admin est refusée', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...base, role: 'admin' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/admin/users sans jeton renvoie 401', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toBe(401);
  });

  test('Route inconnue renvoie 404', async () => {
    const res = await request(app).get('/api/inconnue');
    expect(res.statusCode).toBe(404);
  });
});
