import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="bg-jaci-blue rounded-lg shadow-lg overflow-hidden text-white p-8 relative flex items-center min-h-[200px]">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://picsum.photos/seed/supermarket/1200/400')" }}
        ></div>
        <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-md">Ofertas da Semana!</h2>
            <p className="max-w-md mb-4 drop-shadow">
                Produtos selecionados com preços especiais para você economizar. Aproveite!
            </p>
            <button className="bg-jaci-red font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-transform duration-300 hover:scale-105 shadow-lg">
                Confira as Ofertas
            </button>
        </div>
    </div>
  );
};

export default PromoBanner;
