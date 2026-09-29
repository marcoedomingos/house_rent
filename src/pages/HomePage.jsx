import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import HeroSearch from '../components/HeroSearch/HeroSearch';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import PriceChart from '../components/PriceChart/PriceChart';
import PriceCalendar from '../components/PriceCalendar/PriceCalendar';
import { properties } from '../data/properties';
import './HomePage.css';

const DESTAQUES = properties.filter(p => p.destaque);

const CIDADES_CAL = ['Lisboa', 'Porto', 'Algarve', 'Braga'];

const MERCADO_RESUMO = [
  { cidade: 'Lisboa', preco: '1.900€', t: 'a_subir', pct: '+4,2%', dica: 'Agir agora' },
  { cidade: 'Porto',  preco: '1.200€', t: 'a_descer', pct: '-3,8%', dica: 'Ótimo momento' },
  { cidade: 'Algarve',preco: '1.620€', t: 'a_subir', pct: '+8,1%', dica: 'Aguardar' },
  { cidade: 'Braga',  preco: '750€',  t: 'estavel', pct: '0,0%', dica: 'Sem pressão' },
];

function TIcon({ t }) {
  if (t === 'a_subir') return <TrendingUp size={14} />;
  if (t === 'a_descer') return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

export default function HomePage() {
  const [cidadeCal, setCidadeCal] = useState('Lisboa');

  return (
    <main className="home">
      {/* ── 1. Hopper-style Hero ───────────────────── */}
      <HeroSearch />

      {/* ── 2. Market Snapshot ────────────────────── */}
      <section className="home__section">
        <div className="container">
          <div className="home__section-header">
            <div>
              <div className="section-label">Análise de Mercado</div>
              <h2 className="section-title">O que está a acontecer?</h2>
            </div>
            <Link to="/mercado" className="btn-secondary hide-mobile">
              Ver análise completa <ArrowRight size={15} />
            </Link>
          </div>

          <div className="home__market-cards">
            {MERCADO_RESUMO.map((m, i) => (
              <motion.div
                key={m.cidade}
                className={`home__mcard home__mcard--${m.t === 'a_subir' ? 'red' : m.t === 'a_descer' ? 'green' : 'blue'}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
              >
                <div className="home__mcard-top">
                  <span className="home__mcard-cidade">{m.cidade}</span>
                  <span className={`home__mcard-badge badge ${m.t === 'a_subir' ? 'badge-red' : m.t === 'a_descer' ? 'badge-green' : 'badge-blue'}`}>
                    <TIcon t={m.t} />{m.pct}
                  </span>
                </div>
                <div className="home__mcard-preco">{m.preco}<small>/mês</small></div>
                <div className={`home__mcard-dica home__mcard-dica--${m.t === 'a_subir' ? 'red' : m.t === 'a_descer' ? 'green' : 'blue'}`}>
                  {m.t === 'a_descer' && '✅'}
                  {m.t === 'a_subir' && '⚡'}
                  {m.t === 'estavel' && '📊'}
                  {' '}{m.dica}
                </div>
                <Link to={`/imoveis?cidade=${m.cidade}`} className="home__mcard-link">
                  Ver imóveis <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Price Calendar (Hopper's key feature) ─ */}
      <section className="home__section home__section--dark">
        <div className="container">
          <div className="home__cal-tabs">
            {CIDADES_CAL.map(c => (
              <button
                key={c}
                className={`home__cal-tab ${cidadeCal === c ? 'home__cal-tab--active' : ''}`}
                onClick={() => setCidadeCal(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <PriceCalendar cidade={cidadeCal} />
        </div>
      </section>

      {/* ── 4. Featured Properties ────────────────── */}
      <section className="home__section">
        <div className="container">
          <div className="home__section-header">
            <div>
              <div className="section-label">Seleccionados pela casaja</div>
              <h2 className="section-title">Imóveis com melhor previsão</h2>
              <p className="section-subtitle" style={{ marginTop: 4 }}>Ordenados por momento ideal para arrendar.</p>
            </div>
            <Link to="/imoveis" className="btn-secondary hide-mobile">
              Ver todos <ArrowRight size={15} />
            </Link>
          </div>

          <div className="home__grid">
            {DESTAQUES.slice(0, 6).map((imovel, i) => (
              <PropertyCard key={imovel.id} imovel={imovel} index={i} />
            ))}
          </div>

          <div className="home__grid-cta">
            <Link to="/imoveis" className="btn-primary">
              Ver todos os imóveis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Price Chart ────────────────────────── */}
      <section className="home__section home__section--dark">
        <div className="container">
          <PriceChart />
        </div>
      </section>

      {/* ── 6. Hopper Explainer ──────────────────── */}
      <section className="home__explainer">
        <div className="container home__explainer-inner">
          <motion.div
            className="home__explainer-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-label">Como funciona</div>
            <h2 className="home__explainer-title">
              Como o Hopper prevê quando voo comprar,<br />
              <span>a casaja prevê quando arrendar</span>
            </h2>
            <p className="home__explainer-desc">
              Analisamos meses de dados históricos para cada imóvel e cidade. O resultado: uma recomendação clara sobre se deve arrendar agora ou esperar.
            </p>
            <div className="home__steps">
              {[
                { n: '1', emoji: '🏙️', t: 'Seleccione a cidade', d: 'Veja a previsão actual do mercado para Lisboa, Porto, Algarve e mais.' },
                { n: '2', emoji: '📅', t: 'Consulte o calendário', d: 'Veja mês a mês qual é a melhor altura para assinar um contrato.' },
                { n: '3', emoji: '🔔', t: 'Active um alerta', d: 'Dizemos-lhe quando o preço do imóvel que quer cai ao seu preço alvo.' },
                { n: '4', emoji: '🏠', t: 'Arrendea com confiança', d: 'Tome a decisão certa, no momento certo, com os dados do lado certo.' },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="home__step"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                >
                  <div className="home__step-num">{step.n}</div>
                  <div className="home__step-emoji">{step.emoji}</div>
                  <div>
                    <div className="home__step-title">{step.t}</div>
                    <div className="home__step-desc">{step.d}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/imoveis" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              Experimentar agora <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right side: Mockup */}
          <motion.div
            className="home__explainer-mockup"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="home__mockup glass-strong">
              <div className="home__mockup-bar">
                {[1,2,3].map(i => <div key={i} className="home__mockup-dot" />)}
              </div>
              <div className="home__mockup-body">
                {/* Fake prediction cards */}
                <div className="home__mock-pred home__mock-pred--green">
                  <span>✅</span>
                  <div>
                    <strong>ÓTIMO MOMENTO</strong>
                    <p>Porto · -3,8% este mês</p>
                  </div>
                </div>
                <div className="home__mock-pred home__mock-pred--red">
                  <span>⚡</span>
                  <div>
                    <strong>ARRENDAR AGORA</strong>
                    <p>Lisboa · +4,2% este mês</p>
                  </div>
                </div>
                <div className="home__mock-pred home__mock-pred--amber">
                  <span>⏳</span>
                  <div>
                    <strong>CONSIDERE ESPERAR</strong>
                    <p>Algarve · +8,1% este mês</p>
                  </div>
                </div>
                {/* Fake mini calendar */}
                <div className="home__mock-cal">
                  {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => {
                    const cols = ['g','g','g','b','b','r','r','r','b','b','g','g'];
                    const cls = { g: 'home__mock-cal-g', r: 'home__mock-cal-r', b: 'home__mock-cal-b' };
                    return <div key={i} className={`home__mock-cal-cell ${cls[cols[i]]}`}>{m}</div>;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
