import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Bell, Heart, Share2, MapPin, BedDouble, Bath, Maximize2,
  Building2, Star, Check, Phone, Mail, Calendar, TrendingUp, TrendingDown, Minus,
  Wifi, Car, TreePine, Waves, Wind, Utensils, ChevronRight
} from 'lucide-react';
import PropertyGallery from '../components/PropertyGallery/PropertyGallery';
import PriceChart from '../components/PriceChart/PriceChart';
import PriceAlert from '../components/PriceAlert/PriceAlert';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import { properties } from '../data/properties';
import { useApp } from '../context/AppContext';
import './ImovelDetailPage.css';

const COMODIDADE_ICONS = {
  'Elevador': Building2,
  'Varanda': TreePine,
  'AC': Wind,
  'Cozinha Equipada': Utensils,
  'Garagem': Car,
  'Vista Mar': Waves,
  'Vista Rio': Waves,
  'Internet Fibra': Wifi,
  'Fibra': Wifi,
  'Piscina': Waves,
};

function TendenciaIcon({ tendencia }) {
  if (tendencia === 'a_subir') return <TrendingUp size={16} />;
  if (tendencia === 'a_descer') return <TrendingDown size={16} />;
  return <Minus size={16} />;
}

export default function ImovelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favoritos, toggleFavorito, temAlerta } = useApp();
  const [alertaAberto, setAlertaAberto] = useState(false);
  const [contactoExpandido, setContactoExpandido] = useState(false);

  const imovel = properties.find(p => p.id === Number(id));

  if (!imovel) {
    return (
      <main className="detail-page detail-page--404">
        <div className="container">
          <h1>Imóvel não encontrado</h1>
          <p>O imóvel que procura não existe ou foi removido.</p>
          <Link to="/imoveis" className="btn-primary">Ver todos os imóveis</Link>
        </div>
      </main>
    );
  }

  const isFavorito = favoritos.includes(imovel.id);
  const comAlerta = temAlerta(imovel.id);

  const similares = properties
    .filter(p => p.id !== imovel.id && (p.cidade === imovel.cidade || p.tipologia === imovel.tipologia))
    .slice(0, 3);

  const disponivel = new Date(imovel.disponivel).toLocaleDateString('pt-PT', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <main className="detail-page">
      {/* Breadcrumb */}
      <div className="detail-page__breadcrumb">
        <div className="container detail-page__breadcrumb-inner">
          <button className="btn-ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <div className="detail-page__breadcrumb-path">
            <Link to="/">Início</Link>
            <ChevronRight size={14} />
            <Link to="/imoveis">Imóveis</Link>
            <ChevronRight size={14} />
            <span>{imovel.titulo}</span>
          </div>
        </div>
      </div>

      <div className="container detail-page__content">
        {/* Main Column */}
        <div className="detail-page__main">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PropertyGallery fotos={imovel.fotos} titulo={imovel.titulo} />
          </motion.div>

          {/* Details */}
          <motion.div
            className="detail-page__info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Header */}
            <div className="detail-page__header">
              <div>
                <div className="detail-page__location">
                  <MapPin size={14} />
                  <span>{imovel.bairro}, {imovel.cidade}</span>
                  <span className="detail-page__location-sep">·</span>
                  <span>{imovel.morada}</span>
                </div>
                <h1 className="detail-page__title">{imovel.titulo}</h1>
              </div>
              <div className="detail-page__actions">
                <button
                  className={`btn-secondary detail-page__action-btn ${isFavorito ? 'detail-page__action-btn--fav' : ''}`}
                  onClick={() => toggleFavorito(imovel.id)}
                  aria-label={isFavorito ? 'Remover favorito' : 'Guardar'}
                >
                  <Heart size={16} fill={isFavorito ? 'currentColor' : 'none'} />
                  <span className="hide-mobile">{isFavorito ? 'Guardado' : 'Guardar'}</span>
                </button>
                <button className="btn-secondary detail-page__action-btn" aria-label="Partilhar">
                  <Share2 size={16} />
                  <span className="hide-mobile">Partilhar</span>
                </button>
              </div>
            </div>

            {/* Specs row */}
            <div className="detail-page__specs">
              <div className="detail-page__spec">
                <BedDouble size={18} />
                <div>
                  <span className="detail-page__spec-val">
                    {imovel.quartos === 0 ? 'Estúdio' : imovel.quartos}
                  </span>
                  <span className="detail-page__spec-label">
                    {imovel.quartos > 0 ? 'Quartos' : ''}
                  </span>
                </div>
              </div>
              <div className="detail-page__spec-divider" />
              <div className="detail-page__spec">
                <Bath size={18} />
                <div>
                  <span className="detail-page__spec-val">{imovel.casasBanho}</span>
                  <span className="detail-page__spec-label">{imovel.casasBanho === 1 ? 'Casa de Banho' : 'Casas de Banho'}</span>
                </div>
              </div>
              <div className="detail-page__spec-divider" />
              <div className="detail-page__spec">
                <Maximize2 size={18} />
                <div>
                  <span className="detail-page__spec-val">{imovel.area}m²</span>
                  <span className="detail-page__spec-label">Área Total</span>
                </div>
              </div>
              <div className="detail-page__spec-divider" />
              <div className="detail-page__spec">
                <Building2 size={18} />
                <div>
                  <span className="detail-page__spec-val">
                    {imovel.andar === 0 ? 'R/C' : `${imovel.andar}º`}
                  </span>
                  <span className="detail-page__spec-label">Andar</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="detail-page__rating">
              <div className="detail-page__stars">
                {[1,2,3,4,5].map(n => (
                  <Star
                    key={n}
                    size={16}
                    fill={n <= Math.round(imovel.avaliacao) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="detail-page__rating-val">{imovel.avaliacao}</span>
              <span className="detail-page__rating-count">({imovel.numAvaliacoes} avaliações)</span>
              <span className="detail-page__rating-sep">·</span>
              <span className="detail-page__disponivel">
                <Calendar size={13} /> Disponível a partir de {disponivel}
              </span>
            </div>

            {/* Trend badge */}
            <div className={`detail-page__trend badge ${
              imovel.tendencia === 'a_subir' ? 'badge-red' :
              imovel.tendencia === 'a_descer' ? 'badge-green' : 'badge-blue'
            }`}>
              <TendenciaIcon tendencia={imovel.tendencia} />
              {imovel.tendencia === 'a_subir' && 'Preço a subir — considere agir agora'}
              {imovel.tendencia === 'a_descer' && 'Preço a descer — bom momento para arrendar'}
              {imovel.tendencia === 'estavel' && 'Preço estável nos últimos 6 meses'}
            </div>

            {/* Description */}
            <div className="detail-page__section">
              <h2 className="detail-page__section-title">Descrição</h2>
              <p className="detail-page__desc">{imovel.descricao}</p>
            </div>

            {/* Amenities */}
            <div className="detail-page__section">
              <h2 className="detail-page__section-title">Comodidades</h2>
              <div className="detail-page__amenities">
                {imovel.comodidades.map(c => {
                  const Icon = COMODIDADE_ICONS[c] || Check;
                  return (
                    <div key={c} className="detail-page__amenity">
                      <div className="detail-page__amenity-icon">
                        <Icon size={16} />
                      </div>
                      <span>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Chart */}
            <div className="detail-page__section">
              <PriceChart
                imovelHistorico={imovel.precoHistorico}
                titulo="Histórico de Preço"
                tendencia={imovel.tendencia}
              />
            </div>

            {/* Map (simulated) */}
            <div className="detail-page__section">
              <h2 className="detail-page__section-title">Localização</h2>
              <div className="detail-page__map">
                <div className="detail-page__map-inner">
                  <div className="detail-page__map-marker">
                    <MapPin size={24} />
                  </div>
                  <div className="detail-page__map-label">
                    <strong>{imovel.bairro}</strong>
                    <span>{imovel.cidade}</span>
                  </div>
                  <div className="detail-page__map-grid" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <aside className="detail-page__sidebar">
          <div className="detail-page__sticky">
            {/* Price Card */}
            <motion.div
              className="detail-page__price-card glass-strong"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="detail-page__price-header">
                <div>
                  <div className="detail-page__price">
                    {imovel.preco.toLocaleString('pt-PT')}€
                    <span>/mês</span>
                  </div>
                  <div className="detail-page__tipologia">{imovel.tipologia} · {imovel.area}m²</div>
                </div>
                <div className={`badge ${imovel.tendencia === 'a_subir' ? 'badge-red' : imovel.tendencia === 'a_descer' ? 'badge-green' : 'badge-blue'}`}>
                  <TendenciaIcon tendencia={imovel.tendencia} />
                </div>
              </div>

              <div className="detail-page__price-breakdown">
                <div className="detail-page__price-row">
                  <span>Renda mensal</span>
                  <span>{imovel.preco.toLocaleString('pt-PT')}€</span>
                </div>
                <div className="detail-page__price-row">
                  <span>Caução estimada</span>
                  <span>{(imovel.preco * 2).toLocaleString('pt-PT')}€</span>
                </div>
                <div className="detail-page__price-divider" />
                <div className="detail-page__price-row detail-page__price-row--total">
                  <span>Total inicial</span>
                  <span>{(imovel.preco * 3).toLocaleString('pt-PT')}€</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="detail-page__ctas">
                <button
                  className={`btn-primary detail-page__alert-btn ${comAlerta ? 'detail-page__alert-btn--active' : ''}`}
                  onClick={() => setAlertaAberto(true)}
                >
                  <Bell size={16} fill={comAlerta ? 'currentColor' : 'none'} />
                  {comAlerta ? 'Alerta activo' : 'Receber Alerta de Preço'}
                </button>

                <button
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => setContactoExpandido(v => !v)}
                >
                  <Phone size={16} />
                  Contactar Proprietário
                </button>

                {contactoExpandido && (
                  <motion.div
                    className="detail-page__contact-expanded"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <a href="tel:+351910000000" className="detail-page__contact-item">
                      <Phone size={14} /> +351 910 000 000
                    </a>
                    <a href="mailto:proprietario@casaja.pt" className="detail-page__contact-item">
                      <Mail size={14} /> proprietario@casaja.pt
                    </a>
                  </motion.div>
                )}
              </div>

              <p className="detail-page__disclaimer">
                Ao contactar, aceita os nossos Termos de Uso e Política de Privacidade.
              </p>
            </motion.div>

            {/* Hopper Recommendation */}
            <motion.div
              className={`detail-page__recommendation ${
                imovel.tendencia === 'a_subir' ? 'detail-page__recommendation--amber' :
                imovel.tendencia === 'a_descer' ? 'detail-page__recommendation--green' :
                'detail-page__recommendation--blue'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="detail-page__rec-icon">
                {imovel.tendencia === 'a_subir' ? '⚠️' : imovel.tendencia === 'a_descer' ? '✅' : '📊'}
              </div>
              <div>
                <div className="detail-page__rec-title">
                  {imovel.tendencia === 'a_subir' && 'Recomendamos agir agora'}
                  {imovel.tendencia === 'a_descer' && 'Excelente momento para arrendar'}
                  {imovel.tendencia === 'estavel' && 'Preço estável, pode esperar'}
                </div>
                <div className="detail-page__rec-desc">
                  {imovel.tendencia === 'a_subir' && 'O preço tem vindo a subir. Activar um alerta pode ser tarde.'}
                  {imovel.tendencia === 'a_descer' && `Poupou ${(imovel.precoHistorico[0].preco - imovel.preco).toLocaleString('pt-PT')}€/mês em relação há 6 meses.`}
                  {imovel.tendencia === 'estavel' && 'Sem pressão de tempo. O preço mantém-se estável.'}
                </div>
              </div>
            </motion.div>
          </div>
        </aside>
      </div>

      {/* Similar Properties */}
      {similares.length > 0 && (
        <section className="detail-page__similares">
          <div className="container">
            <div className="section-label">Pode também gostar</div>
            <h2 className="section-title">Imóveis Semelhantes</h2>
            <div className="detail-page__similares-grid">
              {similares.map((imovel, i) => (
                <PropertyCard key={imovel.id} imovel={imovel} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Alert Modal */}
      {alertaAberto && (
        <PriceAlert imovel={imovel} onClose={() => setAlertaAberto(false)} />
      )}
    </main>
  );
}
