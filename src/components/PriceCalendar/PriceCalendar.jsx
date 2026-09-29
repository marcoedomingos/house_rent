import './PriceCalendar.css';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Simulated monthly price index (0=cheapest, 1=most expensive) for rentals in Portugal
const DADOS_MENSAIS = {
  Lisboa:  [0.85, 0.80, 0.82, 0.88, 0.92, 0.95, 1.00, 1.00, 0.97, 0.90, 0.83, 0.80],
  Porto:   [0.82, 0.78, 0.80, 0.85, 0.90, 0.93, 0.98, 0.95, 0.90, 0.85, 0.80, 0.77],
  Algarve: [0.60, 0.58, 0.65, 0.80, 0.95, 1.00, 1.00, 1.00, 0.90, 0.72, 0.62, 0.58],
  Braga:   [0.90, 0.88, 0.89, 0.90, 0.92, 0.93, 0.95, 0.94, 0.91, 0.90, 0.89, 0.88],
};

function getColor(val) {
  if (val <= 0.75) return 'cal-cell--great';
  if (val <= 0.87) return 'cal-cell--good';
  if (val <= 0.94) return 'cal-cell--ok';
  return 'cal-cell--expensive';
}

function getLabel(val) {
  if (val <= 0.75) return 'Ótimo';
  if (val <= 0.87) return 'Bom';
  if (val <= 0.94) return 'Médio';
  return 'Caro';
}

const mesAtual = new Date().getMonth(); // 0-indexed

export default function PriceCalendar({ cidade = 'Lisboa' }) {
  const dados = DADOS_MENSAIS[cidade] || DADOS_MENSAIS.Lisboa;

  return (
    <div className="price-cal">
      <div className="price-cal__header">
        <div>
          <div className="section-label">Melhor altura para arrendar</div>
          <h3 className="price-cal__title">Calendário de Preços — {cidade}</h3>
          <p className="price-cal__desc">Verde = preços baixos, ideal para arrendar. Como o Hopper, mas para casas.</p>
        </div>
        <div className="price-cal__legend">
          <span className="price-cal__leg price-cal__leg--great">Ótimo</span>
          <span className="price-cal__leg price-cal__leg--good">Bom</span>
          <span className="price-cal__leg price-cal__leg--ok">Médio</span>
          <span className="price-cal__leg price-cal__leg--expensive">Caro</span>
        </div>
      </div>

      <div className="price-cal__grid">
        {MESES.map((mes, i) => {
          const val = dados[i];
          const cls = getColor(val);
          const label = getLabel(val);
          const isNow = i === mesAtual;
          return (
            <div key={mes} className={`cal-cell ${cls} ${isNow ? 'cal-cell--now' : ''}`}>
              <div className="cal-cell__mes">{mes}</div>
              <div className="cal-cell__label">{label}</div>
              {isNow && <div className="cal-cell__now-dot" />}
            </div>
          );
        })}
      </div>

      <div className="price-cal__tip">
        💡 <strong>Dica:</strong> {
          cidade === 'Algarve'
            ? 'Evite arrendar no Algarve entre Junho e Agosto. Janeiro e Fevereiro têm os preços mais baixos.'
            : cidade === 'Lisboa'
            ? 'Lisboa é mais barata entre Novembro e Fevereiro. Evite Julho e Agosto.'
            : cidade === 'Porto'
            ? 'Porto tem melhores preços no inverno. Considere arrendar entre Dezembro e Março.'
            : 'Braga mantém preços estáveis ao longo do ano. Pode arrendar em qualquer mês.'
        }
      </div>
    </div>
  );
}
