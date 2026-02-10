import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { XIcon, TrashIcon, PlusIcon, MinusIcon } from './icons/Icons';

const Cart: React.FC = () => {
  const {
    isCartOpen,
    toggleCart,
    cart,
    updateCartQuantity,
    removeFromCart,
    setView,
    isTotalAConfirmar,
  } = useAppContext();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    toggleCart();
    setView('checkout');
  };

  const formatQty = (qty: number, unit: 'unit' | 'kg') => {
    if (unit === 'kg') return String(qty).replace('.', ',');
    return String(Math.trunc(qty));
  };

  const getStep = (unit: 'unit' | 'kg') => (unit === 'kg' ? 0.5 : 1);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-40 shadow-xl transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Carrinho</h2>
            <button
              onClick={toggleCart}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Seu carrinho está vazio.
            </p>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cartKey}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatQty(item.quantity, item.selectedUnit)}{' '}
                          {item.selectedUnit === 'kg' ? 'kg' : 'un'}
                        </p>
                        <p className="text-sm font-semibold text-jaci-blue">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.cartKey,
                            item.quantity - getStep(item.selectedUnit)
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MinusIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.cartKey,
                            item.quantity + getStep(item.selectedUnit)
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className="p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  {isTotalAConfirmar ? (
                    <span className="text-sm font-medium text-gray-700 text-right max-w-[55%]">
                      Seu pedido será conferido e em alguns minutos enviaremos o total.
                    </span>
                  ) : (
                    <span className="text-2xl font-bold text-jaci-blue">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-jaci-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Finalizar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
