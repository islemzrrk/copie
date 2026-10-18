import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('quiz_theme', dark ? 'dark' : 'light');
    } catch {
      /* stockage indisponible : on ignore */
    }
  }, [dark]);

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDark((d) => !d)}>
      {dark ? 'Mode copie' : 'Mode tableau'}
    </button>
  );
}
