# Plateforme d'apprentissage en ligne avec quiz interactifs

Sprint 1 : fondations et authentification (US1, US2).
Pile : Node.js + Express, PostgreSQL, JWT, bcrypt.

## 1. Base de données

1. Créer la base `quiz_platform` dans pgAdmin.
2. Exécuter le script `backend/db/01_users.sql` dans cette base.

## 2. Configuration

```bash
cd backend
copy .env.example .env      # Windows (sous macOS/Linux : cp .env.example .env)
```

Ouvrir `.env` et remplacer `VOTRE_MOT_DE_PASSE` par le mot de passe de l'utilisateur `postgres`,
ainsi que `JWT_SECRET` par une longue phrase secrète. Ne jamais pousser `.env` sur GitHub.

## 3. Installation et lancement

```bash
npm install
npm run dev
```

Le serveur démarre sur http://localhost:3000. Test rapide : http://localhost:3000/api/health

## 4. Routes de l'API

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | /api/health | public | Vérifie que l'API répond |
| POST | /api/auth/register | public | Crée un compte (role : `etudiant` ou `enseignant`) |
| POST | /api/auth/login | public | Connexion, renvoie un jeton JWT |
| GET | /api/users/me | connecté | Consulter son profil |
| PUT | /api/users/me | connecté | Modifier son nom et son e-mail |

Pour les routes protégées, envoyer l'en-tête `Authorization: Bearer <jeton>`.

### Exemples Postman (corps JSON)

POST /api/auth/register
```json
{ "nom": "Islem Test", "email": "islem@test.com", "mot_de_passe": "motdepasse123", "role": "etudiant" }
```

POST /api/auth/login
```json
{ "email": "islem@test.com", "mot_de_passe": "motdepasse123" }
```

## 5. Compte administrateur

L'inscription publique n'accepte pas le rôle `admin`. Pour créer un administrateur :
1. S'inscrire normalement (rôle `etudiant`).
2. Dans pgAdmin : `UPDATE users SET role = 'admin' WHERE email = 'votre@email.com';`

## 6. Tests

```bash
npm test
```

## 7. Structure

```
backend/
├── db/                 scripts SQL
├── src/
│   ├── config/         connexion PostgreSQL
│   ├── controllers/    logique des routes
│   ├── middlewares/    verifyToken, requireRole
│   ├── routes/
│   ├── app.js
│   └── server.js
└── tests/              tests Jest + Supertest
```
