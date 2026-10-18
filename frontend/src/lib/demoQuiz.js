// Quiz d'essai de la page d'accueil : il fonctionne sans serveur.
export const TOTAL_SECONDS = 90;

export const QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    kind: 'QCM à choix unique',
    text: 'Quelle bibliothèque construit les pages de la plateforme ?',
    options: [
      { id: 'a', label: 'React' },
      { id: 'b', label: 'PostgreSQL' },
      { id: 'c', label: 'Express' },
      { id: 'd', label: 'Jest' },
    ],
    correct: 'a',
    explanation: 'React gère l’interface. Express, lui, vit côté serveur.',
  },
  {
    id: 'q2',
    type: 'multiple',
    kind: 'QCM à choix multiples',
    text: 'Quelles technologies tournent côté serveur ?',
    options: [
      { id: 'a', label: 'Node.js' },
      { id: 'b', label: 'Tailwind CSS' },
      { id: 'c', label: 'Express' },
      { id: 'd', label: 'React' },
    ],
    correct: ['a', 'c'],
    explanation: 'Node.js exécute l’API et Express la structure. Tailwind et React servent l’interface.',
  },
  {
    id: 'q3',
    type: 'boolean',
    kind: 'Vrai ou faux',
    text: 'Un mot de passe doit être enregistré tel quel dans la base de données.',
    options: [
      { id: 'true', label: 'Vrai' },
      { id: 'false', label: 'Faux' },
    ],
    correct: 'false',
    explanation: 'On n’enregistre qu’une empreinte hachée (bcrypt), jamais le mot de passe lui-même.',
  },
  {
    id: 'q4',
    type: 'short',
    kind: 'Réponse courte',
    text: 'Quel sigle désigne le jeton qui prouve qu’un utilisateur est connecté ?',
    accepted: ['jwt', 'json web token'],
    display: 'JWT',
    explanation: 'Le JSON Web Token est envoyé à chaque requête protégée.',
  },
];
