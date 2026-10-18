import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DemoQuiz from '../components/DemoQuiz';
import RoleTabs from '../components/RoleTabs';

const STEPS = [
  ['L’enseignant crée un cours', 'Titre, description et ressources : PDF, vidéo ou lien.'],
  ['Il publie un quiz', 'Durée, période de disponibilité et nombre de tentatives.'],
  ['L’étudiant répond', 'Le minuteur tourne ; à zéro, la copie est rendue.'],
  ['La note tombe', 'Correction automatique, historique et statistiques par question.'],
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_minmax(0,34rem)]">
        <div>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            Des quiz qui se corrigent tout seuls.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-ink-soft">
            Les enseignants publient leurs cours et leurs quiz. Les étudiants s’entraînent, reçoivent leur
            note tout de suite et suivent leur progression.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link to="/profile" className="btn btn-primary">Mon profil</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Créer un compte</Link>
                <Link to="/login" className="btn btn-ghost">Se connecter</Link>
              </>
            )}
          </div>
          <p className="mt-8 -rotate-1 font-hand text-3xl text-pen">
            Essayez la copie d’essai : 4 questions, 90 secondes.
          </p>
        </div>

        <DemoQuiz />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Un espace pour chaque rôle</h2>
        <RoleTabs />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight">Du cours à la note, en quatre temps</h2>
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="border-t-2 border-ink bg-paper pt-4">
              <span className="font-hand text-4xl text-pen">{i + 1}</span>
              <h3 className="mt-1 text-lg font-bold leading-snug">{title}</h3>
              <p className="mt-2 text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
