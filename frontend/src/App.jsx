import { Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Page introuvable</h1>
      <p className="mt-3 text-ink-soft">Cette adresse n’existe pas ou a changé.</p>
      <Link to="/" className="btn btn-primary mt-8">Retour à l’accueil</Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-sheet focus:px-3 focus:py-2">
        Aller au contenu
      </a>
      <Navbar />
      <div id="contenu">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
