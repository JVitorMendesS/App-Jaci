import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import defaultLogo from '../assets/logo2.png';


type StoreConfig = {
  logoUrl: string;
  primaryColor: string;
};

type StoreConfigContextType = {
  config: StoreConfig;
  updateConfig: (partial: Partial<StoreConfig>) => void;
};

const DEFAULT_CONFIG: StoreConfig = {
  logoUrl: defaultLogo,        // usa a logo atual como padrão
  primaryColor: '#0057b8',    // azul atual (bg-jaci-blue)
};

const StoreConfigContext =
  createContext<StoreConfigContextType | undefined>(undefined);

export const StoreConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useLocalStorage<StoreConfig>(
    'storeConfig',
    DEFAULT_CONFIG
  );

  const updateConfig = (partial: Partial<StoreConfig>) => {
    const merged = { ...config, ...partial };
    setConfig(merged);

    // Atualiza a cor global (se quiser usar em CSS depois)
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--primary-color',
        merged.primaryColor
      );
    }
  };

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--primary-color',
        config.primaryColor
      );
    }
  }, [config.primaryColor]);

  return (
    <StoreConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => {
  const ctx = useContext(StoreConfigContext);
  if (!ctx) {
    throw new Error('useStoreConfig deve ser usado dentro de StoreConfigProvider');
  }
  return ctx;
};
