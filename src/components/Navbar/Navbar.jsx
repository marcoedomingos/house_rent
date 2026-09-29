import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Menu, X, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const { favoritos } = useApp();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'navbar--solid' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          casaja
        </Link>

        <div className="navbar__links hide-mobile">
          <Link to="/imoveis" className="navbar__link">Arrendar</Link>
          <Link to="/mercado" className="navbar__link">Mercado</Link>
          <Link to="/imoveis" className="navbar__link">Ofertas</Link>
        </div>

        <div className="navbar__actions">
          <Link to="/favoritos" className="navbar__fav">
            <Heart size={18} fill={favoritos.length > 0 ? 'currentColor' : 'none'} />
            {favoritos.length > 0 && <span className="navbar__fav-badge">{favoritos.length}</span>}
          </Link>
          <button className="navbar__auth hide-mobile">
            Iniciar sessão
          </button>
          <button className="navbar__mobile-btn hide-desktop" onClick={() => setMenuAberto(v => !v)}>
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
