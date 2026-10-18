import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';
import Field from '../components/Field';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', mot_de_passe: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/profile" replace />;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Connexion"
      subtitle="Retrouvez vos cours et vos résultats."
      footer={<>Pas encore de compte ? <Link to="/register" className="font-semibold underline decoration-pen decoration-2 underline-offset-4">Créer un compte</Link></>}
    >
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <Field label="Adresse e-mail" id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} required />
        <Field label="Mot de passe" id="mot_de_passe" name="mot_de_passe" type="password" autoComplete="current-password" value={form.mot_de_passe} onChange={onChange} required />
        {error && <p role="alert" className="border-l-4 border-pen bg-sheet px-3 py-2 font-semibold text-pen">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy || !form.email || !form.mot_de_passe}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </AuthCard>
  );
}
