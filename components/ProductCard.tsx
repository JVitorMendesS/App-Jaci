import React, { useMemo, useState } from "react";
import { Product } from "../types";
import { useAppContext } from "../contexts/AppContext";
import { PlusCircleIcon } from "./icons/Icons";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();

  // Rótulo de unidade exibido no card (preço base do produto)
  const unitLabel = product.unit_type === "kg" ? "kg" : "un";

  // Modal states (apenas para produtos de peso)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unitChoice, setUnitChoice] = useState<"unit" | "kg">("kg");
  const [qty, setQty] = useState<string>("1");

  const qtyHint = useMemo(() => {
    return unitChoice === "kg" ? "kg (ex: 0,5)" : "un (ex: 2)";
  }, [unitChoice]);

  const openModal = () => {
    // padrão: se o produto é de peso, começa em kg
    setUnitChoice("kg");
    setQty("1");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    if (!qty) return;

    const normalized = qty.replace(",", ".");
    const parsed = parseFloat(normalized);

    if (Number.isNaN(parsed) || parsed <= 0) {
      alert("Por favor, informe uma quantidade válida.");
      return;
    }

    if (unitChoice === "unit" && !Number.isInteger(parsed)) {
      alert("Para unidade, use número inteiro (ex: 1, 2, 3).");
      return;
    }

    addToCart(product, parsed, unitChoice);
    closeModal();
  };

  const handleAddToCart = () => {
    // 🔹 Se for vendido em KG (cadastro), agora pergunta: unidade ou kg + quantidade
    if (product.unit_type === "kg") {
      openModal();
      return;
    }

    // 🔹 Se for vendido por unidade, adiciona 1 direto
    addToCart(product, 1, "unit");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        {/* Imagem */}
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-jaci-dark mb-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              {product.description}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-2">
            {/* Preço com unidade base do produto */}
            <span className="text-xl font-bold text-jaci-blue">
              R$ {product.price.toFixed(2).replace(".", ",")} / {unitLabel}
            </span>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center space-x-2 bg-jaci-red text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-300"
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <PlusCircleIcon />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: somente para produtos cadastrados como kg */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-bold text-jaci-dark">{product.name}</h3>
              <button
                onClick={closeModal}
                className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Deseja comprar por <b>unidade</b> ou por <b>quilo</b>?
            </p>

            <div className="flex gap-2 mb-4">
              <button
                className={`flex-1 rounded-md border px-3 py-2 ${
                  unitChoice === "unit" ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => {
                  setUnitChoice("unit");
                  // sugere inteiro se o usuário trocar pra unidade
                  if (qty.includes(".") || qty.includes(",")) setQty("1");
                }}
              >
                Unidade
              </button>

              <button
                className={`flex-1 rounded-md border px-3 py-2 ${
                  unitChoice === "kg" ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => setUnitChoice("kg")}
              >
                Quilo
              </button>
            </div>

            <label className="block text-sm font-medium mb-1 text-jaci-dark">
              Quantidade ({qtyHint})
            </label>

            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full rounded-md border p-2 mb-4"
              inputMode={unitChoice === "kg" ? "decimal" : "numeric"}
              placeholder={unitChoice === "kg" ? "Ex: 0,5" : "Ex: 2"}
            />

            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border px-3 py-2 hover:bg-gray-50"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                className="rounded-md bg-jaci-red px-3 py-2 text-white hover:bg-red-700"
                onClick={handleConfirm}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
