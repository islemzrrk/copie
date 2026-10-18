export default function Field({ label, id, hint, ...props }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-semibold">{label}</label>
      <input id={id} className="input" {...props} />
      {hint && <p className="text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}
