import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './HeroSearch.css';

export default function HeroSearch() {
  const { filtros, atualizarFiltro } = useApp();
  const navigate = useNavigate();
  const [cidadeSel, setCidadeSel] = useState(filtros.cidade || 'Lisboa');
  const [tipoSel, setTipoSel] = useState(filtros.tipologia || 'Todas');
  
  const handlePesquisa = () => {
    atualizarFiltro('cidade', cidadeSel);
    atualizarFiltro('tipologia', tipoSel);
    navigate('/imoveis');
  };

  return (
    <section className="hero">
      <div className="hero__bg">
        <img 
          src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Portugal Coast" 
          className="hero__bg-img"
        />
        <div className="hero__bg-overlay" />
      </div>

      <div className="container hero__content">
        {/* Search Pill */}
        <motion.div
          className="hero__search-pill"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="hero__search-field">
            <span className="hero__search-label">Onde</span>
            <select 
              value={cidadeSel} 
              onChange={e => setCidadeSel(e.target.value)}
              className="hero__search-input"
            >
              <option value="Todas">Qualquer destino</option>
              <option value="Lisboa">Lisboa</option>
              <option value="Porto">Porto</option>
              <option value="Algarve">Algarve</option>
              <option value="Braga">Braga</option>
              <option value="Cascais">Cascais</option>
            </select>
          </div>
          
          <div className="hero__search-divider" />
          
          <div className="hero__search-field">
            <span className="hero__search-label">Tipologia</span>
            <select 
              value={tipoSel} 
              onChange={e => setTipoSel(e.target.value)}
              className="hero__search-input"
            >
              <option value="Todas">Qualquer tipo</option>
              <option value="T1">T1</option>
              <option value="T2">T2</option>
              <option value="T3">T3</option>
              <option value="T4+">T4+</option>
            </select>
          </div>

          <div className="hero__search-divider" />
          
          <div className="hero__search-field">
            <span className="hero__search-label">Orçamento</span>
            <input 
              type="text" 
              placeholder="Qualquer valor" 
              className="hero__search-input"
              readOnly
            />
          </div>

          <button className="hero__search-btn" onClick={handlePesquisa}>
            <Search size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
