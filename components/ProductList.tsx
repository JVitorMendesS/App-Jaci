import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from './ProductCard';
import PromoBanner from './PromoBanner';
import { SearchIcon } from './icons/Icons';

const ProductList: React.FC = () => {
  const { products } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PromoBanner />
      
      <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-jaci-dark">Nossos Produtos</h2>
            <div className="relative w-full sm:w-auto">
                <input 
                    type="text"
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                </div>
            </div>
        </div>
        
        {products.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Nenhum produto cadastrado ainda.</p>
        ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Nenhum produto encontrado para "{searchTerm}".</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;