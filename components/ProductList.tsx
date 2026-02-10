import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from './ProductCard';
import PromoBanner from './PromoBanner';
import { SearchIcon } from './icons/Icons';

const ProductList: React.FC = () => {
  const { products, loadingProducts } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Lista de categorias únicas (ignorando vazias)
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.category?.trim())
            .filter((c): c is string => !!c)
        )
      ).sort(),
    [products]
  );

  // Filtro de produtos
  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
            // Match por nome
      const nameMatch = product.name.toLowerCase().includes(search);

      // Match por categoria digitada
      const categoryText = (product.category || '').toLowerCase();
      const categoryMatch =
        !search || categoryText.includes(search);

      // Match por tags digitadas
      const tagsMatch =
        (product.tags || []).some(tag =>
          tag.toLowerCase().includes(search)
        );

      // Match por filtro selecionado no select
      const categoryFilterMatch =
        !selectedCategory || product.category === selectedCategory;

      // Retorno final
      return (nameMatch || categoryMatch || tagsMatch) && categoryFilterMatch;

    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Banner de promoções */}
      <PromoBanner />

      {/* Seção de produtos */}
      <section className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* Topo: título + filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-jaci-dark">
            Produtos disponíveis
          </h2>

          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-end w-full md:w-auto">
            {/* Campo de busca */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou categoria..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
              />
            </div>

            {/* Select de categorias */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-jaci-blue"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conteúdo: loading / vazio / grid */}
        {loadingProducts ? (
          <p className="text-center text-gray-500 py-10">
            Carregando produtos...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Nenhum produto encontrado para &quot;{searchTerm}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;
