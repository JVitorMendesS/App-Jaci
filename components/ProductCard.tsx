
import React from 'react';
import { Product } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { PlusCircleIcon } from './icons/Icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-jaci-dark mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-jaci-blue">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center space-x-2 bg-jaci-red text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition-colors duration-300"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <PlusCircleIcon />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
