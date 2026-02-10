import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { StoreConfigProvider } from './contexts/StoreConfigContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';


const AppContent: React.FC = () => {
  const { isAuthenticated, view } = useAppContext();

  if (isAuthenticated) {
    return (
      <div className="bg-jaci-light min-h-screen font-sans text-jaci-dark">
        <Header />
        <main className="container mx-auto p-4 md:p-6">
          <AdminPanel />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-jaci-light min-h-screen font-sans text-jaci-dark">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        {view === 'products' && <ProductList />}
        {view === 'checkout' && <Checkout />}
        {view === 'login' && <Login />}
      </main>
      <Cart />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreConfigProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </StoreConfigProvider>
  );
};

export default App;
