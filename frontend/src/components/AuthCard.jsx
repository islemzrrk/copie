export default function AuthCard({ title, subtitle, children, footer, wide = false }) {
  return (
    <main className={`mx-auto px-5 py-12 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
      <div className="sheet py-8 pl-12 pr-5 sm:pl-[76px] sm:pr-8">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <p className="mt-5 text-center">{footer}</p>}
    </main>
  );
}
