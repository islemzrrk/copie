// Choix façon feuille de QCM : rond = un seul choix, carré = plusieurs choix possibles.
export default function Choice({ type = 'checkbox', name, value, checked, onChange, children }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded border-2 px-3 py-2 ${
        checked ? 'border-ink bg-mark/40' : 'border-line'
      }`}
    >
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className={`bubble ${type === 'checkbox' ? 'square' : ''}`} data-on={checked} aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}
