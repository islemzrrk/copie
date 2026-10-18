import { useState } from 'react';
import { Check } from './Marks';

const ROLES = [
  {
    id: 'etudiant',
    label: 'Étudiant',
    items: [
      'S’inscrire avec son niveau : lycée (1ère, 2ème, 3ème année, Bac) ou faculté',
      'Consulter le catalogue et s’inscrire à un cours',
      'Passer un quiz avec minuteur',
      'Recevoir la correction et le score tout de suite',
      'Suivre son historique et sa progression',
      'Recevoir des notifications sur les quiz et les échéances',
    ],
  },
  {
    id: 'enseignant',
    label: 'Enseignant',
    items: [
      'Indiquer ses matières et ses niveaux d’enseignement',
      'Créer, publier et gérer ses cours',
      'Ajouter des ressources : PDF, vidéo ou lien',
      'Créer des quiz avec durée, disponibilité et tentatives',
      'Ajouter et ordonner les questions',
      'Consulter la moyenne et le taux de réussite par question',
    ],
  },
  {
    id: 'admin',
    label: 'Administrateur',
    items: ['Valider ou refuser les nouvelles inscriptions', 'Gérer les comptes et attribuer les rôles', 'Modérer les cours et les quiz'],
  },
];

export default function RoleTabs() {
  const [active, setActive] = useState('etudiant');
  const role = ROLES.find((r) => r.id === active);

  const onKeyDown = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + ROLES.length) % ROLES.length;
    setActive(ROLES[next].id);
    document.getElementById(`tab-${ROLES[next].id}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Rôles de la plateforme" className="relative z-10 -mb-0.5 flex gap-1">
        {ROLES.map((r, i) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            id={`tab-${r.id}`}
            aria-selected={active === r.id}
            aria-controls="panel-roles"
            tabIndex={active === r.id ? 0 : -1}
            onClick={() => setActive(r.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`rounded-t-md border-2 border-b-0 px-4 py-2 font-semibold ${
              active === r.id ? 'border-ink bg-sheet' : 'border-line bg-paper text-ink-soft hover:text-ink'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="panel-roles" aria-labelledby={`tab-${active}`} className="sheet rounded-tl-none border-2 border-ink py-7 pl-12 pr-5 sm:pl-[76px] sm:pr-8">
        {/* key : la liste est remontée à chaque onglet, les coches se retracent */}
        <ul key={active} className="grid gap-3 sm:grid-cols-2">
          {role.items.map((item) => (
            <li key={item} className="flex gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-ok" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
