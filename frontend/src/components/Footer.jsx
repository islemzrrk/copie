import { APP_NAME, TEAM } from '../config';

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-ink-soft">
        {APP_NAME} : plateforme d’apprentissage en ligne avec quiz interactifs. Projet de {TEAM}.
      </p>
    </footer>
  );
}
