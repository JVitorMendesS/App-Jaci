import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Product } from "../types";
import { PlusIcon, EditIcon, TrashIcon } from "./icons/Icons";
import StoreConfigPanel from "./StoreConfigPanel";

const AdminPanel: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();

  // Aba ativa (produtos ou configurações)
  const [activeTab, setActiveTab] = useState<"products" | "store">("products");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
    tags: "",
    unit_type: "unit", // 👈 novo campo: unidade padrão
  });

  // Busca
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Filtra produtos
  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return products;

    return products.filter((product) => {
      const text = [
        product.name,
        product.category,
        product.description,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(search);
    });
  }, [products, searchTerm]);

  // Popula formulário no modal
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || "",
        price: currentProduct.price?.toString() || "",
        description: currentProduct.description || "",
        imageUrl:
          currentProduct.imageUrl || "https://picsum.photos/400/300",
        category: currentProduct.category || "",
        tags: currentProduct.tags ? currentProduct.tags.join(", ") : "",
        unit_type: currentProduct.unit_type || "unit",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        imageUrl: "https://picsum.photos/400/300",
        category: "",
        tags: "",
        unit_type: "unit",
      });
    }
  }, [currentProduct]);

  // Abrir modal
  const openModal = (product: Partial<Product> | null = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  // Fechar modal
  const closeModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(false);
  };

  // Handle inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Salvar produto
 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const tagsArray = formData.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const productData = {
    name: formData.name,
    price: parseFloat(formData.price),
    description: formData.description,
    imageUrl:
      formData.imageUrl ||
      `https://picsum.photos/seed/${formData.name.replace(/\s+/g, "")}/400/300`,
    category: formData.category || "",
    tags: tagsArray,
    unit_type: formData.unit_type === "kg" ? "kg" : "unit", // garante só 'unit' ou 'kg'
  };

  if (currentProduct) {
    // 👇 aqui eu deixo explícito pro TS que isso é um Product
    updateProduct({ ...productData, id: currentProduct.id } as Product);
  } else {
    // 👇 e aqui que isso é um Omit<Product, 'id'>
    addProduct(productData as Omit<Product, "id">);
  }

  closeModal();
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* -------------------- ABAS -------------------- */}
      <div className="flex gap-2 border-b mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${
            activeTab === "products"
              ? "bg-jaci-blue text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Produtos
        </button>

        <button
          className={`px-4 py-2 rounded-t-lg font-semibold text-sm ${
            activeTab === "store"
              ? "bg-jaci-blue text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setActiveTab("store")}
        >
          Configuração da Loja
        </button>
      </div>

      {/* -------------------- ABA: PRODUTOS ------------------- */}
      {activeTab === "products" && (
        <>
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-jaci-dark">
              Gerenciar Produtos
            </h2>

            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-jaci-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon />
              Adicionar Produto
            </button>
          </div>

          {/* Campo de busca */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-jaci-dark">Lista de Produtos</h2>

            <input
              type="text"
              placeholder="Buscar por nome, categoria ou tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-jaci-blue"
            />
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Produto</th>
                  <th className="py-2 px-4 border-b text-left">Categoria</th>
                  <th className="py-2 px-4 border-b text-left">Preço</th>
                  <th className="py-2 px-4 border-b text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b flex items-center gap-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      {product.name}
                    </td>

                    <td className="py-2 px-4 border-b">
                      {product.category || "-"}
                    </td>

                    <td className="py-2 px-4 border-b">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </td>

                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openModal(product)}
                        className="text-jaci-blue hover:text-blue-700 mr-4"
                      >
                        <EditIcon />
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-jaci-red hover:text-red-700"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------------------- MODAL ---------------------- */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">
                  {currentProduct ? "Editar Produto" : "Novo Produto"}
                </h3>

                <form onSubmit={handleSubmit}>
                  {/* Nome */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="name">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                      required
                    />
                  </div>

                  {/* Preço */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="price">
                      Preço
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                      required
                    />
                  </div>

                  {/* Tipo de unidade */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 mb-1"
                      htmlFor="unit_type"
                    >
                      Tipo de venda
                    </label>
                    <select
                      id="unit_type"
                      name="unit_type"
                      value={formData.unit_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                    >
                      <option value="unit">Unidade</option>
                      <option value="kg">Quilo (kg)</option>
                    </select>
                  </div>

                  {/* Categoria */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="category">
                      Categoria
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      placeholder="Ex: Bebidas, Hortifruti, Mercearia..."
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                    />
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="tags">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="Ex: refrigerante, gelado, lata"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                    />
                  </div>

                  {/* Descrição */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 mb-1"
                      htmlFor="description"
                    >
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                    />
                  </div>

                  {/* URL imagem */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 mb-1"
                      htmlFor="imageUrl"
                    >
                      URL da Imagem
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="bg-jaci-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------------- ABA: CONFIGURAÇÃO DA LOJA ------------ */}
      {activeTab === "store" && <StoreConfigPanel />}
    </div>
  );
};

export default AdminPanel;
