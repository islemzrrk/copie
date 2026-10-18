# Copie : front-end de la plateforme de quiz

React 18 + Vite + Tailwind CSS 4, connecté à l'API du dossier `backend`.

## Lancer

1. Démarrer l'API (dans `backend`) : `npm run dev`
2. Dans ce dossier :

```bash
npm install
npm run dev
```

3. Ouvrir http://localhost:5173

L'adresse de l'API se règle dans `.env` (copier `.env.example`) : `VITE_API_URL=http://localhost:3000/api`

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Accueil avec le quiz d'essai interactif (fonctionne sans serveur) |
| `/register` | Création de compte (étudiant ou enseignant) |
| `/login` | Connexion |
| `/profile` | Profil protégé par le jeton JWT : consultation et modification |

## Personnaliser

- Nom de l'application et auteurs : `src/config.js`
- Couleurs (mode copie et mode tableau) : variables en haut de `src/index.css`
- Questions du quiz d'essai : `src/lib/demoQuiz.js`

## Structure

```
src/
├── components/   DemoQuiz, RoleTabs, Navbar, ThemeToggle, ...
├── context/      AuthContext (connexion, jeton, utilisateur)
├── lib/          api.js (appels à l'API), demoQuiz.js
├── pages/        Home, Login, Register, Profile
└── index.css     thème Tailwind (copie Seyès / tableau)
```
