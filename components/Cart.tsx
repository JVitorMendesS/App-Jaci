
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { XIcon, TrashIcon, PlusIcon, MinusIcon } from './icons/Icons';

const Cart: React.FC = () => {
  const { isCartOpen, toggleCart, cart, updateCartQuantity, removeFromCart, setView } = useAppContext();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    toggleCart();
    setView('checkout');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-40 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <header className="p-4 flex justify-between items-center border-b bg-jaci-blue text-white">
            <h2 className="text-xl font-bold">Seu Carrinho</h2>
            <button onClick={toggleCart} className="p-1 rounded-full hover:bg-white/20" aria-label="Fechar carrinho">
              <XIcon />
            </button>
          </header>

          <div className="flex-grow p-4 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">Seu carrinho está vazio.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map(item => (
                  <li key={item.id} className="flex items-start space-x-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-jaci-blue font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      <div className="flex items-center mt-2">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-l-md hover:bg-gray-100"><MinusIcon/></button>
                        <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-r-md hover:bg-gray-100"><PlusIcon/></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-jaci-red" aria-label={`Remover ${item.name}`}>
                      <TrashIcon />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <footer className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-jaci-blue">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-jaci-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-lg"
              >
                Finalizar Pedido
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
