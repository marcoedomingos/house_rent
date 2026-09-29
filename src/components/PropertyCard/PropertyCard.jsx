import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, TrendingUp, TrendingDown, Minus, MapPin, Maximize2, Bath, BedDouble, Bell, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './PropertyCard.css';

function verdictConfig(tendencia, preco, precoHistorico) {
  const primeiro = precoHistorico?.[0]?.preco || preco;
  const poupanca = primeiro - preco;

  if (tendencia === 'a_descer') {
    return {
      cls: 'pcard--green',
      bannerCls: 'pcard__banner--green',
      label: 'ÓTIMO MOMENTO',
      icon: '✅',
      hint: poupanca > 0 ? `-${poupanca.toLocaleString('pt-PT')}€ vs há 6 meses` : 'Preço a descer',
      badgeCls: 'pcard__verdict-badge--green',
    };
  }
  if (tendencia === 'a_subir') {
    return {
      cls: 'pcard--red',
      bannerCls: 'pcard__banner--red',
      label: 'ARRENDAR AGORA',
      icon: '⚡',
      hint: 'Preço vai subir',
      badgeCls: 'pcard__verdict-badge--red',
    };
  }
  return {
    cls: 'pcard--blue',
    bannerCls: 'pcard__banner--blue',
    label: 'ESTÁVEL',
    icon: '📊',
    hint: 'Sem pressão de tempo',
    badgeCls: 'pcard__verdict-badge--blue',
  };
}

export default function PropertyCard({ imovel, index = 0 }) {
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const { favoritos, toggleFavorito, temAlerta } = useApp();
  const isFavorito = favoritos.includes(imovel.id);
  const comAlerta = temAlerta(imovel.id);
  const verdict = verdictConfig(imovel.tendencia, imovel.preco, imovel.precoHistorico);

  return (
    <motion.article
      className={`pcard ${verdict.cls}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      {/* ── Verdict Banner (like Hopper's "Book Now" strip) */}
      <div className={`pcard__banner ${verdict.bannerCls}`}>
        <div className="pcard__banner-left">
          <span className="pcard__banner-icon">{verdict.icon}</span>
          <span className="pcard__banner-label">{verdict.label}</span>
        </div>
        <span className="pcard__banner-hint">{verdict.hint}</span>
      </div>

      {/* Image */}
      <div className="pcard__img-wrap">
        <Link to={`/imovel/${imovel.id}`}>
          <img
            src={`${imovel.fotos[fotoAtiva]}&auto=format&q=80`}
            alt={imovel.titulo}
            className="pcard__img"
            loading="lazy"
          />
        </Link>

        {/* Favorite & Alert */}
        <div className="pcard__actions">
          <button
            className={`pcard__fav-btn ${isFavorito ? 'pcard__fav-btn--active' : ''}`}
            onClick={() => toggleFavorito(imovel.id)}
            aria-label={isFavorito ? 'Remover favorito' : 'Guardar'}
          >
            <Heart size={15} fill={isFavorito ? 'currentColor' : 'none'} />
          </button>
          {comAlerta && (
            <div className="pcard__alert-dot" title="Alerta activo">
              <Bell size={12} />
            </div>
          )}
        </div>

        {/* Dots */}
        {imovel.fotos.length > 1 && (
          <div className="pcard__dots">
            {imovel.fotos.map((_, i) => (
              <button
                key={i}
                className={`pcard__dot ${i === fotoAtiva ? 'pcard__dot--active' : ''}`}
                onMouseEnter={() => setFotoAtiva(i)}
                onClick={() => setFotoAtiva(i)}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <Link to={`/imovel/${imovel.id}`} className="pcard__body">
        {/* Price + rating */}
        <div className="pcard__top">
          <div className="pcard__price-wrap">
            <span className="pcard__price">{imovel.preco.toLocaleString('pt-PT')}€</span>
            <span className="pcard__period">/mês</span>
          </div>
          <div className="pcard__rating">
            <Star size={12} fill="currentColor" />
            <span>{imovel.avaliacao}</span>
            <span className="pcard__rating-count">({imovel.numAvaliacoes})</span>
          </div>
        </div>

        <h3 className="pcard__title">{imovel.titulo}</h3>

        <div className="pcard__location">
          <MapPin size={12} />
          <span>{imovel.bairro}, {imovel.cidade}</span>
        </div>

        <div className="pcard__specs">
          <span className="pcard__spec">
            <BedDouble size={13} />
            {imovel.quartos === 0 ? 'Estúdio' : `${imovel.quartos}q`}
          </span>
          <span className="pcard__spec-sep">·</span>
          <span className="pcard__spec">
            <Bath size={13} />
            {imovel.casasBanho}wc
          </span>
          <span className="pcard__spec-sep">·</span>
          <span className="pcard__spec">
            <Maximize2 size={13} />
            {imovel.area}m²
          </span>
        </div>

        {/* Price mini-chart bars */}
        <div className="pcard__mini-chart">
          {imovel.precoHistorico?.map((p, i) => {
            const max = Math.max(...imovel.precoHistorico.map(x => x.preco));
            const min = Math.min(...imovel.precoHistorico.map(x => x.preco));
            const range = max - min || 1;
            const pct = ((p.preco - min) / range) * 100;
            const isLast = i === imovel.precoHistorico.length - 1;
            return (
              <div key={i} className="pcard__bar-wrap" title={`${p.mes}: ${p.preco}€`}>
                <div
                  className={`pcard__bar ${isLast ? 'pcard__bar--current' : ''}`}
                  style={{ height: `${Math.max(20, pct)}%` }}
                />
              </div>
            );
          })}
        </div>

        <div className="pcard__footer">
          <span className="pcard__tipologia">{imovel.tipologia}</span>
          <span className="pcard__cta">
            Ver imóvel <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
