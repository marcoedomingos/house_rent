import { Link } from 'react-router-dom';
import { Home, Globe, AtSign, ExternalLink, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-icon">
              <Home size={16} strokeWidth={2.5} />
            </div>
            <span>casa<span className="green">ja</span></span>
          </div>
          <p className="footer__tagline">
            A forma mais inteligente de encontrar a sua casa em Portugal. Previsões de preço, alertas personalizados e os melhores imóveis ao seu alcance.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram" className="footer__social-btn"><AtSign size={16} /></a>
            <a href="#" aria-label="Twitter" className="footer__social-btn"><Globe size={16} /></a>
            <a href="#" aria-label="LinkedIn" className="footer__social-btn"><ExternalLink size={16} /></a>
            <a href="#" aria-label="Email" className="footer__social-btn"><Mail size={16} /></a>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__links-group">
            <h4>Imóveis</h4>
            <Link to="/imoveis">Todos os Imóveis</Link>
            <Link to="/imoveis?cidade=Lisboa">Lisboa</Link>
            <Link to="/imoveis?cidade=Porto">Porto</Link>
            <Link to="/imoveis?cidade=Algarve">Algarve</Link>
          </div>
          <div className="footer__links-group">
            <h4>Ferramentas</h4>
            <Link to="/mercado">Análise de Mercado</Link>
            <a href="#">Calculadora de Renda</a>
            <a href="#">Guia do Arrendatário</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer__links-group">
            <h4>Empresa</h4>
            <a href="#">Sobre Nós</a>
            <a href="#">Carreiras</a>
            <a href="#">Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2024 casaja. Todos os direitos reservados.</p>
          <p>Feito com ❤️ em Portugal</p>
        </div>
      </div>
    </footer>
  );
}
