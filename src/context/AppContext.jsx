import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [filtros, setFiltros] = useState({
    cidade: 'Todas',
    tipologia: 'Todas',
    precoMin: 0,
    precoMax: 6000,
    quartos: null,
    comodidades: [],
    pesquisa: '',
  });

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('casaja_favoritos') || '[]');
    } catch {
      return [];
    }
  });

  const [alertas, setAlertas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('casaja_alertas') || '[]');
    } catch {
      return [];
    }
  });

  const atualizarFiltro = useCallback((campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({
      cidade: 'Todas',
      tipologia: 'Todas',
      precoMin: 0,
      precoMax: 6000,
      quartos: null,
      comodidades: [],
      pesquisa: '',
    });
  }, []);

  const toggleFavorito = useCallback((id) => {
    setFavoritos(prev => {
      const novos = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('casaja_favoritos', JSON.stringify(novos));
      return novos;
    });
  }, []);

  const adicionarAlerta = useCallback((alerta) => {
    setAlertas(prev => {
      const novos = [...prev, { ...alerta, id: Date.now() }];
      localStorage.setItem('casaja_alertas', JSON.stringify(novos));
      return novos;
    });
  }, []);

  const removerAlerta = useCallback((id) => {
    setAlertas(prev => {
      const novos = prev.filter(a => a.id !== id);
      localStorage.setItem('casaja_alertas', JSON.stringify(novos));
      return novos;
    });
  }, []);

  const temAlerta = useCallback((imovelId) => {
    return alertas.some(a => a.imovelId === imovelId);
  }, [alertas]);

  return (
    <AppContext.Provider value={{
      filtros,
      atualizarFiltro,
      limparFiltros,
      favoritos,
      toggleFavorito,
      alertas,
      adicionarAlerta,
      removerAlerta,
      temAlerta,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
