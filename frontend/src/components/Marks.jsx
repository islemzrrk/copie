// Coche et croix tracées comme au stylo : l'animation se rejoue à chaque affichage.
export function Check({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="draw" d="M4 13l5 5L20 6" />
    </svg>
  );
}

export function Cross({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path className="draw" d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
