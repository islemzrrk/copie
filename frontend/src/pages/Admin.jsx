import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Check, Cross } from '../components/Marks';

const TABS = [
  ['en_attente', 'En attente'],
  ['valide', 'Validés'],
  ['refuse', 'Refusés'],
];
const ROLE_LABELS = { etudiant: 'Étudiant', enseignant: 'Enseignant' };
const EMPTY = {
  en_attente: 'Aucune demande en attente.',
  valide: 'Aucun compte validé pour le moment.',
  refuse: 'Aucun compte refusé.',
};

function Details({ u }) {
  if (u.role === 'etudiant') {
    return <p className="text-sm">Niveau : <span className="font-semibold">{u.niveau?.libelle || 'Non renseigné'}</span></p>;
  }
  return (
    <div className="grid gap-0.5 text-sm">
      <p>Matières : <span className="font-semibold">{u.matieres.join(', ') || 'Non renseignées'}</span></p>
      <p>Niveaux : <span className="font-semibold">{u.niveaux.map((n) => n.libelle).join(', ') || 'Non renseignés'}</span></p>
    </div>
  );
}

export default function Admin() {
  const { user, loading } = useAuth();
  const [statut, setStatut] = useState('en_attente');
  const [data, setData] = useState({ users: [], counts: {} });
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [refusing, setRefusing] = useState(null); // identifiant du compte en cours de refus
  const [motif, setMotif] = useState('');
  const isAdmin = user?.role === 'admin';

  const load = useCallback(async () => {
    setError('');
    try {
      setData(await api.adminUsers(statut));
    } catch (err) {
      setError(err.message);
    }
  }, [statut]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (loading) return <p className="px-5 py-12 text-center">Chargement…</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const decide = async (id, nextStatut, reason) => {
    setBusyId(id);
    setError('');
    try {
      await api.adminSetStatut(id, { statut: nextStatut, motif: reason });
      setRefusing(null);
      setMotif('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const changeTab = (value) => {
    setStatut(value);
    setRefusing(null);
    setMotif('');
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Administration</h1>
      <p className="mt-2 text-ink-soft">Validez ou refusez les nouvelles inscriptions.</p>

      <div role="tablist" aria-label="Statut des comptes" className="mt-6 flex flex-wrap gap-2">
        {TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={statut === value}
            onClick={() => changeTab(value)}
            className={`rounded border-2 px-4 py-2 font-semibold ${statut === value ? 'border-ink bg-mark/40' : 'border-line bg-paper text-ink-soft hover:text-ink'}`}
          >
            {label} ({data.counts[value] ?? 0})
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-5 border-l-4 border-pen bg-sheet px-3 py-2 font-semibold text-pen">{error}</p>}

      <ul className="mt-6 grid gap-4" aria-live="polite">
        {data.users.length === 0 && !error && (
          <li className="rounded border-2 border-dashed border-line bg-sheet px-4 py-8 text-center text-ink-soft">{EMPTY[statut]}</li>
        )}

        {data.users.map((u) => (
          <li key={u.id} className="rounded border-2 border-line bg-sheet p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="grid gap-1">
                <p className="text-lg font-bold leading-tight">{u.nom}</p>
                <p className="text-sm text-ink-soft">{u.email}</p>
                <p><span className="marker px-1 text-sm font-bold">{ROLE_LABELS[u.role] || u.role}</span></p>
                <Details u={u} />
                {u.statut === 'refuse' && u.motif_refus && (
                  <p className="text-sm text-pen">Motif du refus : {u.motif_refus}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {u.statut !== 'valide' && (
                  <button type="button" className="btn btn-primary btn-sm" disabled={busyId === u.id} onClick={() => decide(u.id, 'valide')}>
                    <Check className="h-4 w-4" /> Valider
                  </button>
                )}
                {u.statut !== 'refuse' && (
                  <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === u.id} onClick={() => { setRefusing(u.id); setMotif(''); }}>
                    <Cross className="h-4 w-4" /> Refuser
                  </button>
                )}
              </div>
            </div>

            {refusing === u.id && (
              <form
                className="mt-4 grid gap-2 border-t-2 border-line pt-4"
                onSubmit={(e) => { e.preventDefault(); decide(u.id, 'refuse', motif); }}
              >
                <label htmlFor={`motif-${u.id}`} className="text-sm font-semibold">Motif du refus (facultatif, visible par l’utilisateur)</label>
                <input id={`motif-${u.id}`} className="input" value={motif} maxLength={300} onChange={(e) => setMotif(e.target.value)} placeholder="Exemple : niveau ou matière non reconnus" />
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={busyId === u.id}>Confirmer le refus</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRefusing(null)}>Annuler</button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
