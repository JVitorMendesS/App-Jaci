import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CheckoutData } from '../types';

const Checkout: React.FC = () => {
  const { cart, sendOrder, isTotalAConfirmar } = useAppContext();
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    address: '',
    paymentMethod: 'Dinheiro',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatQty = (qty: number, unit: 'unit' | 'kg') => {
    if (unit === 'kg') return String(qty).replace('.', ',');
    return String(Math.trunc(qty));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOrder(formData);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.cartKey}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {formatQty(item.quantity, item.selectedUnit)}{' '}
                  {item.selectedUnit === 'kg' ? 'kg' : 'un'}
                </p>
              </div>
              <p className="font-semibold text-jaci-blue">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          {isTotalAConfirmar ? (
            <span className="text-sm font-medium text-gray-700 text-right max-w-[60%]">
              Seu pedido será conferido e em alguns minutos enviaremos o total.
            </span>
          ) : (
            <span className="text-jaci-blue">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Dados para Entrega</h3>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-jaci-blue"
            required
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Seu endereço"
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-jaci-blue"
            required
          />

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-jaci-blue"
          >
            <option value="Dinheiro">Dinheiro</option>
            <option value="Pix">Pix</option>
            <option value="Cartão">Cartão</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-jaci-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Enviar Pedido no WhatsApp
        </button>
      </form>
    </div>
  );
};

export default Checkout;
