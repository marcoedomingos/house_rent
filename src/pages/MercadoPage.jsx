import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceChart from '../components/PriceChart/PriceChart';
import { dadosMercado, properties } from '../data/properties';
import './MercadoPage.css';

const INSIGHTS = [
  {
    titulo: 'Lisboa lidera subida de preços',
    desc: 'O mercado lisboeta continua pressionado. Chiado e Príncipe Real registam as maiores subidas. Recomendamos agir antes do verão.',
    tendencia: 'a_subir',
    variacao: '+4,2%',
    cidade: 'Lisboa',
  },
  {
    titulo: 'Porto em correcção saudável',
    desc: 'Após anos de subidas expressivas, o Porto começa a corrigir. Bom momento para quem procura arrendar em zonas como Cedofeita ou Foz.',
    tendencia: 'a_descer',
    variacao: '-3,8%',
    cidade: 'Porto',
  },
  {
    titulo: 'Algarve com procura recorde',
    desc: 'A época alta prolongou-se e a procura internacional mantém-se elevada. Preços a subir, especialmente em Albufeira e Lagos.',
    tendencia: 'a_subir',
    variacao: '+8,1%',
    cidade: 'Algarve',
  },
  {
    titulo: 'Braga estabiliza após crescimento',
    desc: 'O mercado bracarense encontrou o seu equilíbrio. Preços competitivos e boa qualidade de vida tornam-no numa excelente alternativa.',
    tendencia: 'estavel',
    variacao: '0,0%',
    cidade: 'Braga',
  },
];

export default function MercadoPage() {
  return (
    <main className="mercado-page">
      {/* Header */}
      <div className="mercado-page__header">
        <div className="container mercado-page__header-inner">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="section-label">Dados em Tempo Real</div>
            <h1 className="mercado-page__title">Análise de Mercado</h1>
            <p className="mercado-page__subtitle">
              Acompanhe as tendências do mercado de arrendamento em Portugal. Dados actualizados mensalmente.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mercado-page__content">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PriceChart />
        </motion.div>

        {/* Insights */}
        <div className="mercado-page__section">
          <div className="section-label">Análise casaja</div>
          <h2 className="section-title">Insights do Mercado</h2>
          <div className="mercado-page__insights">
            {INSIGHTS.map((insight, i) => (
              <motion.div
                key={insight.cidade}
                className="mercado-page__insight glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="mercado-page__insight-top">
                  <div className={`badge ${insight.tendencia === 'a_subir' ? 'badge-red' : insight.tendencia === 'a_descer' ? 'badge-green' : 'badge-blue'}`}>
                    {insight.tendencia === 'a_subir' ? <TrendingUp size={12} /> : insight.tendencia === 'a_descer' ? <TrendingDown size={12} /> : <Minus size={12} />}
                    {insight.variacao}
                  </div>
                  <span className="mercado-page__insight-cidade">{insight.cidade}</span>
                </div>
                <h3 className="mercado-page__insight-titulo">{insight.titulo}</h3>
                <p className="mercado-page__insight-desc">{insight.desc}</p>
                <Link to={`/imoveis?cidade=${insight.cidade}`} className="mercado-page__insight-link">
                  Ver imóveis em {insight.cidade} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mercado-page__cta glass">
          <div className="mercado-page__cta-content">
            <h2>Receba alertas de mercado</h2>
            <p>Seja notificado quando os preços mudarem nas cidades que lhe interessam.</p>
          </div>
          <Link to="/imoveis" className="btn-primary">
            Configurar Alertas <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
