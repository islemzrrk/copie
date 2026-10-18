import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';
import Field from '../components/Field';
import { Check } from '../components/Marks';

const ROLE_LABELS = { etudiant: 'Étudiant', enseignant: 'Enseignant', admin: 'Administrateur' };

export default function Profile() {
  const { user, loading, setUser, logout } = useAuth();
  const [form, setForm] = useState({ nom: '', email: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setForm({ nom: user.nom, email: user.email });
  }, [user]);

  if (loading) return <p className="px-5 py-12 text-center">Chargement…</p>;
  if (!user) return <Navigate to="/login" replace />;

  const onChange = (e) => {
    setStatus({ type: '', message: '' });
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const updated = await api.updateMe(form);
      setUser(updated);
      setStatus({ type: 'ok', message: 'Modifications enregistrées.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const since = new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AuthCard title="Mon profil" subtitle={`Compte créé le ${since}.`}>
      <dl className="mb-6 grid gap-2">
        <div>
          <dt className="inline text-ink-soft">Rôle : </dt>
          <dd className="marker inline px-1 font-bold">{ROLE_LABELS[user.role] || user.role}</dd>
        </div>
        {user.role === 'etudiant' && (
          <div>
            <dt className="inline text-ink-soft">Niveau : </dt>
            <dd className="inline font-semibold">{user.niveau?.libelle || 'Non renseigné'}</dd>
          </div>
        )}
        {user.role === 'enseignant' && (
          <>
            <div>
              <dt className="inline text-ink-soft">Matières : </dt>
              <dd className="inline font-semibold">{user.matieres?.join(', ') || 'Non renseignées'}</dd>
            </div>
            <div>
              <dt className="inline text-ink-soft">Niveaux : </dt>
              <dd className="inline font-semibold">{user.niveaux?.map((n) => n.libelle).join(', ') || 'Non renseignés'}</dd>
            </div>
          </>
        )}
      </dl>

      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <Field label="Nom complet" id="nom" name="nom" value={form.nom} onChange={onChange} required />
        <Field label="Adresse e-mail" id="email" name="email" type="email" value={form.email} onChange={onChange} required />

        <div aria-live="polite">
          {status.type === 'ok' && (
            <p className="flex items-center gap-2 font-semibold text-ok"><Check className="h-5 w-5" />{status.message}</p>
          )}
          {status.type === 'error' && (
            <p role="alert" className="border-l-4 border-pen bg-sheet px-3 py-2 font-semibold text-pen">{status.message}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary" disabled={busy || !form.nom.trim() || !form.email.trim()}>
            Enregistrer les modifications
          </button>
          <button type="button" className="btn btn-ghost" onClick={logout}>Se déconnecter</button>
        </div>
      </form>
    </AuthCard>
  );
}
