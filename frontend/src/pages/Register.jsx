import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';
import Field from '../components/Field';
import Choice from '../components/Choice';

const ROLES = [
  ['etudiant', 'Étudiant'],
  ['enseignant', 'Enseignant'],
];

const YEARS = [
  ['lycee_1', '1ère année'],
  ['lycee_2', '2ème année'],
  ['lycee_3', '3ème année'],
  ['lycee_bac', 'Bac'],
];

const toggle = (list, setList, value) =>
  setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ nom: '', email: '', mot_de_passe: '', role: 'etudiant' });
  const [cycle, setCycle] = useState(''); // 'lycee' | 'fac'
  const [annee, setAnnee] = useState(''); // lycee_1 ... lycee_bac
  const [matieres, setMatieres] = useState([]); // identifiants
  const [niveaux, setNiveaux] = useState([]); // codes
  const [reference, setReference] = useState({ niveaux: [], matieres: [] });
  const [referenceError, setReferenceError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.reference().then(setReference).catch((err) => setReferenceError(err.message));
  }, []);

  if (user) return <Navigate to="/profile" replace />;

  const isTeacher = form.role === 'enseignant';
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const niveauEtudiant = cycle === 'fac' ? 'fac' : annee;

  const baseValid = form.nom.trim() && form.email.trim() && form.mot_de_passe.length >= 8;
  const profileValid = isTeacher ? matieres.length > 0 && niveaux.length > 0 : Boolean(niveauEtudiant);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = { ...form };
      if (isTeacher) Object.assign(payload, { matieres, niveaux });
      else payload.niveau = niveauEtudiant;
      await register(payload);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Demande envoyée" subtitle="Votre inscription est enregistrée.">
        <p>
          Un administrateur doit valider votre compte avant votre première connexion. Revenez vous connecter
          un peu plus tard : si votre demande est acceptée, vous accéderez à votre espace.
        </p>
        <Link to="/login" className="btn btn-primary mt-6">Aller à la connexion</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      wide
      title="Créer un compte"
      subtitle="Choisissez votre rôle, puis indiquez votre niveau. Un administrateur valide chaque inscription."
      footer={<>Déjà inscrit ? <Link to="/login" className="font-semibold underline decoration-pen decoration-2 underline-offset-4">Se connecter</Link></>}
    >
      <form onSubmit={onSubmit} className="grid gap-5" noValidate>
        <fieldset className="grid gap-2">
          <legend className="font-semibold">Je suis</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(([value, label]) => (
              <Choice key={value} type="radio" name="role" value={value} checked={form.role === value} onChange={onChange}>
                {label}
              </Choice>
            ))}
          </div>
        </fieldset>

        {!isTeacher && (
          <>
            <fieldset className="grid gap-2">
              <legend className="font-semibold">Mon niveau</legend>
              <div className="grid grid-cols-2 gap-3">
                <Choice type="radio" name="cycle" value="lycee" checked={cycle === 'lycee'} onChange={() => setCycle('lycee')}>Lycée</Choice>
                <Choice type="radio" name="cycle" value="fac" checked={cycle === 'fac'} onChange={() => { setCycle('fac'); setAnnee(''); }}>Faculté</Choice>
              </div>
            </fieldset>

            {cycle === 'lycee' && (
              <fieldset className="grid gap-2">
                <legend className="font-semibold">Mon année au lycée</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {YEARS.map(([code, label]) => (
                    <Choice key={code} type="radio" name="annee" value={code} checked={annee === code} onChange={() => setAnnee(code)}>
                      {label}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            )}
          </>
        )}

        {isTeacher && (
          <>
            {referenceError && (
              <p role="alert" className="border-l-4 border-pen bg-sheet px-3 py-2 font-semibold text-pen">
                Impossible de charger les matières et les niveaux : {referenceError}
              </p>
            )}
            <fieldset className="grid gap-2">
              <legend className="font-semibold">Matières enseignées</legend>
              <p className="text-sm text-ink-soft">Choisissez au moins une matière.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {reference.matieres.map((m) => (
                  <Choice key={m.id} name="matieres" value={m.id} checked={matieres.includes(m.id)} onChange={() => toggle(matieres, setMatieres, m.id)}>
                    {m.nom}
                  </Choice>
                ))}
              </div>
            </fieldset>

            <fieldset className="grid gap-2">
              <legend className="font-semibold">Niveaux enseignés</legend>
              <p className="text-sm text-ink-soft">Choisissez au moins un niveau.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {reference.niveaux.map((n) => (
                  <Choice key={n.code} name="niveaux" value={n.code} checked={niveaux.includes(n.code)} onChange={() => toggle(niveaux, setNiveaux, n.code)}>
                    {n.libelle}
                  </Choice>
                ))}
              </div>
            </fieldset>
          </>
        )}

        <Field label="Nom complet" id="nom" name="nom" autoComplete="name" value={form.nom} onChange={onChange} required />
        <Field label="Adresse e-mail" id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} required />
        <Field label="Mot de passe" id="mot_de_passe" name="mot_de_passe" type="password" autoComplete="new-password" hint="8 caractères minimum." value={form.mot_de_passe} onChange={onChange} required />

        {error && <p role="alert" className="border-l-4 border-pen bg-sheet px-3 py-2 font-semibold text-pen">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy || !baseValid || !profileValid}>
          {busy ? 'Envoi…' : 'Envoyer ma demande'}
        </button>
      </form>
    </AuthCard>
  );
}
