
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Product } from '../types';
import { PlusIcon, EditIcon, TrashIcon } from './icons/Icons';

const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', imageUrl: '' });

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || '',
        price: currentProduct.price?.toString() || '',
        description: currentProduct.description || '',
        imageUrl: currentProduct.imageUrl || '',
      });
    } else {
      setFormData({ name: '', price: '', description: '', imageUrl: 'https://picsum.photos/400/300' });
    }
  }, [currentProduct]);

  const openModal = (product: Partial<Product> | null = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name.replace(/\s+/g, '')}/400/300`
    };

    if (currentProduct && currentProduct.id) {
      updateProduct({ ...productData, id: currentProduct.id });
    } else {
      addProduct(productData);
    }
    closeModal();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-jaci-dark">Gerenciar Produtos</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-jaci-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon />
          Adicionar Produto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Produto</th>
              <th className="py-2 px-4 border-b text-left">Preço</th>
              <th className="py-2 px-4 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b flex items-center gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
                    {product.name}
                </td>
                <td className="py-2 px-4 border-b">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => openModal(product)} className="text-jaci-blue hover:text-blue-700 mr-4"><EditIcon /></button>
                  <button onClick={() => deleteProduct(product.id)} className="text-jaci-red hover:text-red-700"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{currentProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
            <form onSubmit={handleSubmit}>
              {['name', 'price', 'description', 'imageUrl'].map(field => (
                <div className="mb-4" key={field}>
                  <label className="block text-gray-700 capitalize mb-1" htmlFor={field}>{field === 'imageUrl' ? 'URL da Imagem' : field}</label>
                  <input
                    type={field === 'price' ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    step={field === 'price' ? '0.01' : undefined}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={closeModal} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400">Cancelar</button>
                <button type="submit" className="bg-jaci-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
