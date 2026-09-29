import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, MapPin, X } from 'lucide-react';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import { properties } from '../data/properties';
import { useApp } from '../context/AppContext';
import './ImovelListPage.css';

const ORDENACAO_OPTS = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'preco_asc', label: 'Preço: Menor primeiro' },
  { value: 'preco_desc', label: 'Preço: Maior primeiro' },
  { value: 'avaliacao', label: 'Melhor avaliação' },
  { value: 'area', label: 'Maior área' },
];

export default function ImovelListPage() {
  const { filtros, atualizarFiltro } = useApp();
  const [ordenacao, setOrdenacao] = useState('relevancia');
  const [layout, setLayout] = useState('grid');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const filtrados = useMemo(() => {
    let lista = [...properties];

    if (filtros.pesquisa) {
      const q = filtros.pesquisa.toLowerCase();
      lista = lista.filter(p =>
        p.titulo.toLowerCase().includes(q) ||
        p.bairro.toLowerCase().includes(q) ||
        p.cidade.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q)
      );
    }

    if (filtros.cidade !== 'Todas') {
      lista = lista.filter(p => p.cidade === filtros.cidade);
    }

    if (filtros.tipologia !== 'Todas') {
      if (filtros.tipologia === 'T4+') {
        lista = lista.filter(p => p.quartos >= 4);
      } else {
        lista = lista.filter(p => p.tipologia === filtros.tipologia);
      }
    }

    lista = lista.filter(p => p.preco >= filtros.precoMin && p.preco <= filtros.precoMax);

    if (filtros.quartos !== null) {
      if (filtros.quartos >= 3) {
        lista = lista.filter(p => p.quartos >= filtros.quartos);
      } else {
        lista = lista.filter(p => p.quartos === filtros.quartos);
      }
    }

    if (filtros.comodidades.length > 0) {
      lista = lista.filter(p =>
        filtros.comodidades.every(c =>
          p.comodidades.some(pc => pc.toLowerCase().includes(c.toLowerCase()))
        )
      );
    }

    // Ordenação
    switch (ordenacao) {
      case 'preco_asc': lista.sort((a, b) => a.preco - b.preco); break;
      case 'preco_desc': lista.sort((a, b) => b.preco - a.preco); break;
      case 'avaliacao': lista.sort((a, b) => b.avaliacao - a.avaliacao); break;
      case 'area': lista.sort((a, b) => b.area - a.area); break;
      default: lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    }

    return lista;
  }, [filtros, ordenacao]);

  return (
    <main className="list-page">
      {/* Toolbar */}
      <div className="list-page__toolbar">
        <div className="container list-page__toolbar-inner">
          {/* Search bar mini */}
          <div className="list-page__search glass">
            <Search size={16} className="list-page__search-icon" />
            <input
              type="text"
              placeholder="Pesquisar por bairro, cidade..."
              value={filtros.pesquisa}
              onChange={e => atualizarFiltro('pesquisa', e.target.value)}
              className="list-page__search-input"
            />
            {filtros.pesquisa && (
              <button onClick={() => atualizarFiltro('pesquisa', '')} className="list-page__search-clear">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="list-page__toolbar-right">
            {/* Mobile filter toggle */}
            <button
              className="btn-secondary hide-desktop list-page__filter-toggle"
              onClick={() => setFiltrosAbertos(v => !v)}
            >
              <SlidersHorizontal size={16} />
              Filtros
              {filtrosAbertos && <X size={14} />}
            </button>

            <select
              value={ordenacao}
              onChange={e => setOrdenacao(e.target.value)}
              className="list-page__sort"
            >
              {ORDENACAO_OPTS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className="list-page__layout-btns hide-mobile">
              <button
                className={`list-page__layout-btn ${layout === 'grid' ? 'list-page__layout-btn--active' : ''}`}
                onClick={() => setLayout('grid')}
                aria-label="Grelha"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                className={`list-page__layout-btn ${layout === 'list' ? 'list-page__layout-btn--active' : ''}`}
                onClick={() => setLayout('list')}
                aria-label="Lista"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container list-page__content">
        {/* Sidebar */}
        <aside className={`list-page__sidebar ${filtrosAbertos ? 'list-page__sidebar--open' : ''}`}>
          <FilterPanel totalResultados={filtrados.length} />
        </aside>

        {/* Results */}
        <div className="list-page__results">
          <div className="list-page__results-header">
            <h1 className="list-page__results-title">
              {filtrados.length > 0
                ? <><span>{filtrados.length}</span> imóveis encontrados</>
                : 'Nenhum imóvel encontrado'
              }
            </h1>
            {filtros.cidade !== 'Todas' && (
              <div className="list-page__active-filters">
                <span className="badge badge-green">
                  <MapPin size={11} /> {filtros.cidade}
                  <button onClick={() => atualizarFiltro('cidade', 'Todas')}><X size={10} /></button>
                </span>
              </div>
            )}
          </div>

          {filtrados.length === 0 ? (
            <div className="list-page__empty">
              <div className="list-page__empty-icon">🏚️</div>
              <h3>Nenhum resultado</h3>
              <p>Tente ajustar os filtros para encontrar mais imóveis.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  atualizarFiltro('cidade', 'Todas');
                  atualizarFiltro('tipologia', 'Todas');
                  atualizarFiltro('pesquisa', '');
                }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={`list-page__grid ${layout === 'list' ? 'list-page__grid--list' : ''}`}>
              {filtrados.map((imovel, i) => (
                <PropertyCard key={imovel.id} imovel={imovel} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
