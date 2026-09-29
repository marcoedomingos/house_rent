import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, TrendingDown, Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './PriceAlert.css';

export default function PriceAlert({ imovel, onClose }) {
  const { adicionarAlerta, temAlerta } = useApp();
  const [step, setStep] = useState(temAlerta(imovel.id) ? 'confirmado' : 'form');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('qualquer');
  const [precoAlvo, setPrecoAlvo] = useState(Math.round(imovel.preco * 0.95));

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarAlerta({
      imovelId: imovel.id,
      titulo: imovel.titulo,
      precoAtual: imovel.preco,
      precoAlvo,
      email,
      tipo,
    });
    setStep('sucesso');
  };

  return (
    <AnimatePresence>
      <div className="overlay" onClick={onClose}>
        <motion.div
          className="price-alert glass-strong"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="price-alert__close" onClick={onClose}>
            <X size={18} />
          </button>

          {step === 'form' && (
            <>
              <div className="price-alert__header">
                <div className="price-alert__icon">
                  <Bell size={24} />
                </div>
                <h2 className="price-alert__title">Alerta de Preço</h2>
                <p className="price-alert__desc">
                  Receba uma notificação quando o preço deste imóvel mudar.
                  Actualmente a <strong>{imovel.preco.toLocaleString('pt-PT')}€/mês</strong>.
                </p>
              </div>

              <form className="price-alert__form" onSubmit={handleSubmit}>
                {/* Tipo de alerta */}
                <div className="price-alert__field">
                  <label className="price-alert__label">Quando notificar</label>
                  <div className="price-alert__types">
                    {[
                      { value: 'qualquer', label: 'Qualquer alteração', icon: '📊' },
                      { value: 'descida', label: 'Quando descer', icon: '📉' },
                      { value: 'alvo', label: 'Preço alvo', icon: '🎯' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`price-alert__type ${tipo === opt.value ? 'price-alert__type--active' : ''}`}
                        onClick={() => setTipo(opt.value)}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preço alvo */}
                {tipo === 'alvo' && (
                  <div className="price-alert__field">
                    <label className="price-alert__label">Preço alvo (€/mês)</label>
                    <div className="price-alert__price-input-wrap">
                      <TrendingDown size={16} className="price-alert__price-icon" />
                      <input
                        type="number"
                        value={precoAlvo}
                        min={100}
                        max={imovel.preco}
                        onChange={e => setPrecoAlvo(Number(e.target.value))}
                        className="price-alert__input"
                      />
                      <span className="price-alert__price-suffix">€/mês</span>
                    </div>
                    <div className="price-alert__price-hint">
                      Poupa {(imovel.preco - precoAlvo).toLocaleString('pt-PT')}€/mês em relação ao preço actual
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="price-alert__field">
                  <label className="price-alert__label">Email de notificação</label>
                  <div className="price-alert__price-input-wrap">
                    <Mail size={16} className="price-alert__price-icon" />
                    <input
                      type="email"
                      value={email}
                      placeholder="o-seu@email.com"
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="price-alert__input"
                    />
                  </div>
                </div>

                <div className="price-alert__disclaimer">
                  <Bell size={12} />
                  Pode cancelar o alerta a qualquer momento na sua área pessoal.
                </div>

                <button type="submit" className="btn-primary price-alert__submit">
                  <Bell size={16} />
                  Activar Alerta de Preço
                </button>
              </form>
            </>
          )}

          {step === 'sucesso' && (
            <div className="price-alert__success">
              <motion.div
                className="price-alert__success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Check size={32} />
              </motion.div>
              <h2>Alerta activado!</h2>
              <p>Vamos notificá-lo em <strong>{email}</strong> quando o preço de <strong>{imovel.titulo}</strong> mudar.</p>
              <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
                Fechar
              </button>
            </div>
          )}

          {step === 'confirmado' && (
            <div className="price-alert__success">
              <div className="price-alert__success-icon price-alert__success-icon--amber">
                <Bell size={32} />
              </div>
              <h2>Alerta já activo</h2>
              <p>Já tem um alerta configurado para este imóvel. Receberá uma notificação quando o preço mudar.</p>
              <button className="btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
                Fechar
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
