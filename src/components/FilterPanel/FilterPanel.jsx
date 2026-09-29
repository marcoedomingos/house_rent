import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cidades, tipologias } from '../../data/properties';
import { useApp } from '../../context/AppContext';
import './FilterPanel.css';

const COMODIDADES_OPCOES = [
  'Elevador', 'Varanda', 'Garagem', 'Piscina', 'AC',
  'Cozinha Equipada', 'Vista Mar', 'Vista Rio', 'Jardim',
  'Fibra', 'Patio', 'Terraço',
];

const QUARTOS_OPTS = [
  { label: 'Todos', value: null },
  { label: '0 (Estúdio)', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3+', value: 3 },
];

export default function FilterPanel({ totalResultados }) {
  const { filtros, atualizarFiltro, limparFiltros } = useApp();
  const [expandedSections, setExpandedSections] = useState({
    cidade: true, tipologia: true, preco: true, quartos: true, comodidades: false,
  });

  const toggleSection = (key) =>
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const temFiltrosAtivos = filtros.cidade !== 'Todas' || filtros.tipologia !== 'Todas' ||
    filtros.precoMin > 0 || filtros.precoMax < 6000 ||
    filtros.quartos !== null || filtros.comodidades.length > 0 || filtros.pesquisa !== '';

  const toggleComodidade = (c) => {
    const lista = filtros.comodidades;
    atualizarFiltro('comodidades', lista.includes(c) ? lista.filter(x => x !== c) : [...lista, c]);
  };

  return (
    <aside className="filter-panel glass">
      <div className="filter-panel__header">
        <div className="filter-panel__title-row">
          <div className="filter-panel__title">
            <SlidersHorizontal size={16} />
            <span>Filtros</span>
          </div>
          {temFiltrosAtivos && (
            <button className="filter-panel__clear" onClick={limparFiltros}>
              <X size={13} /> Limpar
            </button>
          )}
        </div>
        {totalResultados !== undefined && (
          <div className="filter-panel__count">{totalResultados} imóvel(eis) encontrado(s)</div>
        )}
      </div>

      {/* Cidade */}
      <FilterSection
        label="Cidade"
        open={expandedSections.cidade}
        onToggle={() => toggleSection('cidade')}
      >
        <div className="filter-panel__options">
          {cidades.map(c => (
            <button
              key={c}
              className={`filter-panel__option ${filtros.cidade === c ? 'filter-panel__option--active' : ''}`}
              onClick={() => atualizarFiltro('cidade', c)}
            >
              {c === 'Todas' ? 'Qualquer Cidade' : c}
              {filtros.cidade === c && <Check size={13} />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tipologia */}
      <FilterSection
        label="Tipologia"
        open={expandedSections.tipologia}
        onToggle={() => toggleSection('tipologia')}
      >
        <div className="filter-panel__chips">
          {tipologias.map(t => (
            <button
              key={t}
              className={`filter-panel__chip ${filtros.tipologia === t ? 'filter-panel__chip--active' : ''}`}
              onClick={() => atualizarFiltro('tipologia', t)}
            >
              {t === 'Todas' ? 'Todas' : t}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Preço */}
      <FilterSection
        label="Preço Mensal"
        open={expandedSections.preco}
        onToggle={() => toggleSection('preco')}
      >
        <div className="filter-panel__price-range">
          <div className="filter-panel__price-vals">
            <span>{filtros.precoMin.toLocaleString('pt-PT')}€</span>
            <span>—</span>
            <span>{filtros.precoMax >= 6000 ? '6.000€+' : `${filtros.precoMax.toLocaleString('pt-PT')}€`}</span>
          </div>
          <div className="filter-panel__range-group">
            <label className="filter-panel__range-label">Mínimo</label>
            <input
              type="range" min="0" max="5000" step="50"
              value={filtros.precoMin}
              onChange={e => atualizarFiltro('precoMin', Number(e.target.value))}
              className="filter-panel__range"
            />
          </div>
          <div className="filter-panel__range-group">
            <label className="filter-panel__range-label">Máximo</label>
            <input
              type="range" min="500" max="6000" step="50"
              value={filtros.precoMax}
              onChange={e => atualizarFiltro('precoMax', Number(e.target.value))}
              className="filter-panel__range"
            />
          </div>
        </div>
      </FilterSection>

      {/* Quartos */}
      <FilterSection
        label="Quartos"
        open={expandedSections.quartos}
        onToggle={() => toggleSection('quartos')}
      >
        <div className="filter-panel__chips">
          {QUARTOS_OPTS.map(opt => (
            <button
              key={String(opt.value)}
              className={`filter-panel__chip ${filtros.quartos === opt.value ? 'filter-panel__chip--active' : ''}`}
              onClick={() => atualizarFiltro('quartos', opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Comodidades */}
      <FilterSection
        label="Comodidades"
        open={expandedSections.comodidades}
        onToggle={() => toggleSection('comodidades')}
      >
        <div className="filter-panel__checkboxes">
          {COMODIDADES_OPCOES.map(c => (
            <label key={c} className="filter-panel__checkbox">
              <input
                type="checkbox"
                checked={filtros.comodidades.includes(c)}
                onChange={() => toggleComodidade(c)}
              />
              <span className="filter-panel__checkbox-box">
                {filtros.comodidades.includes(c) && <Check size={10} />}
              </span>
              {c}
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({ label, open, onToggle, children }) {
  return (
    <div className="filter-section">
      <button className="filter-section__header" onClick={onToggle}>
        <span className="filter-section__label">{label}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <motion.div
          className="filter-section__body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
