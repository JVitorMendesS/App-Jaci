import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ShoppingCartIcon, UserCogIcon, LogoutIcon } from './icons/Icons';
import { useStoreConfig } from '../contexts/StoreConfigContext';

import logoJaci from '../assets/logo2.png';

const Header: React.FC = () => {
  const { cart, isAuthenticated, toggleCart, logout, setView } = useAppContext();
  const { config } = useStoreConfig();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className="sticky top-0 z-20 bg-white shadow-md"
      style={{ borderBottom: `4px solid ${config.primaryColor}` }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setView('products')}
          className="flex items-center gap-3"
        >
          <img
            src={config.logoUrl || logoJaci}
            alt="Mercado do Jaci"
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight hidden sm:block">
            Mercado do Jaci
          </h1>
        </button>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setView('login')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Painel Admin"
              >
                <UserCogIcon className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Sair"
              >
                <LogoutIcon className="w-6 h-6 text-gray-700" />
              </button>
            </>
          ) : null}

          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Carrinho"
          >
            <ShoppingCartIcon className="w-7 h-7 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-jaci-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
