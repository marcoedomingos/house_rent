import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Area, AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { dadosMercado } from '../../data/properties';
import './PriceChart.css';

const CIDADES_MERCADO = Object.keys(dadosMercado);
const CORES = {
  Lisboa: '#00c896',
  Porto: '#3b82f6',
  Algarve: '#f59e0b',
  Braga: '#a78bfa',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="price-chart__tooltip">
      <div className="price-chart__tooltip-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="price-chart__tooltip-item" style={{ color: p.color }}>
          <span>{p.dataKey}</span>
          <span className="price-chart__tooltip-val">{p.value.toLocaleString('pt-PT')}€/mês</span>
        </div>
      ))}
    </div>
  );
}

export default function PriceChart({ imovelHistorico, titulo, tendencia }) {
  const [cidadesAtivas, setCidadesAtivas] = useState(['Lisboa', 'Porto']);

  // If displaying individual property chart
  if (imovelHistorico) {
    const ultimo = imovelHistorico[imovelHistorico.length - 1]?.preco;
    const primeiro = imovelHistorico[0]?.preco;
    const diff = ultimo - primeiro;
    const pct = ((diff / primeiro) * 100).toFixed(1);
    const subindo = diff > 0;

    return (
      <div className="price-chart price-chart--imovel">
        <div className="price-chart__header">
          <div>
            <div className="section-label">Histórico de Preço</div>
            <h3 className="price-chart__title">{titulo || 'Evolução do Preço'}</h3>
          </div>
          <div className={`price-chart__change ${subindo ? 'price-chart__change--up' : 'price-chart__change--down'}`}>
            {subindo ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{subindo ? '+' : ''}{pct}%</span>
            <span className="price-chart__change-period">6 meses</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={imovelHistorico} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrecoImovel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={subindo ? '#ef4444' : '#00c896'} stopOpacity={0.2} />
                <stop offset="95%" stopColor={subindo ? '#ef4444' : '#00c896'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="preco"
              stroke={subindo ? '#ef4444' : '#00c896'}
              strokeWidth={2.5}
              fill="url(#colorPrecoImovel)"
              dot={{ fill: subindo ? '#ef4444' : '#00c896', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="price-chart__hopper-box">
          {tendencia === 'a_subir' && (
            <>
              <span className="price-chart__hopper-icon">⚠️</span>
              <span><strong>O preço está a subir.</strong> Recomendamos arrendar agora antes de nova subida.</span>
            </>
          )}
          {tendencia === 'a_descer' && (
            <>
              <span className="price-chart__hopper-icon">✅</span>
              <span><strong>Bom momento!</strong> O preço tem vindo a descer. Considere avançar.</span>
            </>
          )}
          {tendencia === 'estavel' && (
            <>
              <span className="price-chart__hopper-icon">📊</span>
              <span><strong>Preço estável.</strong> Pode aguardar, mas não há pressão de tempo.</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Market chart (for Home page)
  const toggleCidade = (cidade) => {
    setCidadesAtivas(prev =>
      prev.includes(cidade) ? prev.filter(c => c !== cidade) : [...prev, cidade]
    );
  };

  // Merge data from all cities
  const meses = dadosMercado.Lisboa.map(d => d.mes);
  const dataFusion = meses.map((mes, i) => {
    const row = { mes };
    CIDADES_MERCADO.forEach(c => {
      row[c] = dadosMercado[c][i]?.preco;
    });
    return row;
  });

  return (
    <div className="price-chart">
      <div className="price-chart__header">
        <div>
          <div className="section-label">Mercado</div>
          <h2 className="price-chart__title">Evolução de Preços por Cidade</h2>
          <p className="price-chart__desc">Comparação dos últimos 7 meses. Dados do mercado de arrendamento.</p>
        </div>
        <div className="price-chart__toggles">
          {CIDADES_MERCADO.map(cidade => (
            <button
              key={cidade}
              className={`price-chart__toggle ${cidadesAtivas.includes(cidade) ? 'price-chart__toggle--active' : ''}`}
              style={{ '--cor': CORES[cidade] }}
              onClick={() => toggleCidade(cidade)}
            >
              <span className="price-chart__toggle-dot" style={{ background: CORES[cidade] }} />
              {cidade}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dataFusion} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
          <Tooltip content={<CustomTooltip />} />
          {CIDADES_MERCADO.filter(c => cidadesAtivas.includes(c)).map(cidade => (
            <Line
              key={cidade}
              type="monotone"
              dataKey={cidade}
              stroke={CORES[cidade]}
              strokeWidth={2.5}
              dot={{ fill: CORES[cidade], r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
