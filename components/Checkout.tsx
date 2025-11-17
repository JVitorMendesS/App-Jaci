
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CheckoutData } from '../types';

const Checkout: React.FC = () => {
  const { cart, sendOrder } = useAppContext();
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    address: '',
    paymentMethod: 'Dinheiro',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, paymentMethod: e.target.value as CheckoutData['paymentMethod']}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOrder(formData);
    alert('Seu pedido foi enviado! O Mercado do Jaci entrará em contato para confirmar.');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-jaci-dark">Carrinho Vazio</h2>
        <p className="text-gray-600 mt-2">Você precisa adicionar itens ao carrinho antes de finalizar o pedido.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-jaci-dark mb-4">Resumo do Pedido</h2>
        <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
            {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </li>
            ))}
        </ul>
        <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span className="text-jaci-blue">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-jaci-dark mb-4">Informações de Entrega</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">Nome Completo</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue" />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 mb-1 font-medium">Endereço de Entrega</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue" placeholder="Ex: Rua das Flores, 123, Bairro Centro"></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Forma de Pagamento</label>
            <div className="space-y-2">
                {['Dinheiro', 'Cartão', 'PIX'].map(method => (
                     <label key={method} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handlePaymentChange} className="w-5 h-5 text-jaci-blue focus:ring-jaci-blue" />
                        <span className="ml-3 text-gray-800">{method}</span>
                    </label>
                ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-jaci-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-lg">
            Enviar Pedido via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
