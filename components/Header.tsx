import React from 'react';
import { useAppContext } from '../contexts/AppContext';
// Fix: Removed unused HomeIcon. The LogoutIcon is now correctly exported from Icons.tsx.
import { ShoppingCartIcon, UserCogIcon, LogoutIcon } from './icons/Icons';
import { logoBase64 } from '../assets/logo';

const Header: React.FC = () => {
  const { cart, isAuthenticated, toggleCart, logout, setView } = useAppContext();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-jaci-blue text-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <div 
          className="flex items-center space-x-4 cursor-pointer"
          onClick={() => setView('products')}
        >
          <img src={logoBase64} alt="Jaci Supermercados Logo" className="h-12" />
          <h1 className="text-2xl font-bold tracking-tight hidden sm:block">Jaci Supermercados</h1>
        </div>
        <nav className="flex items-center space-x-2 md:space-x-4">
          {isAuthenticated ? (
            <>
              <span className="font-semibold hidden md:block">Painel do Admin</span>
              <button 
                onClick={logout} 
                className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                aria-label="Sair do modo administrador"
                title="Sair"
              >
                <LogoutIcon />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setView('login')} 
                className="p-2 rounded-full hover:bg-white/20 transition-colors" 
                aria-label="Login do Administrador"
                title="Admin Login"
              >
                <UserCogIcon />
              </button>
              <button 
                onClick={toggleCart} 
                className="relative p-2 rounded-full hover:bg-white/20 transition-colors" 
                aria-label="Abrir carrinho de compras"
              >
                <ShoppingCartIcon />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-jaci-red rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
