
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Product, CartItem, AppView, CheckoutData } from '../types';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  isAuthenticated: boolean;
  isCartOpen: boolean;
  view: AppView;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  toggleCart: () => void;
  setView: (view: AppView) => void;
  sendOrder: (checkoutData: CheckoutData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProducts: Product[] = [
    { id: '1', name: 'Pão Francês', price: 0.75, imageUrl: 'https://picsum.photos/seed/pao/400/300', description: 'Pão fresquinho, ideal para o seu café da manhã.' },
    { id: '2', name: 'Leite Integral 1L', price: 4.50, imageUrl: 'https://picsum.photos/seed/leite/400/300', description: 'Leite de vaca integral, fonte de cálcio.' },
    { id: '3', name: 'Café em Pó 500g', price: 12.90, imageUrl: 'https://picsum.photos/seed/cafe/400/300', description: 'Café torrado e moído de alta qualidade.' },
    { id: '4', name: 'Queijo Minas Frescal', price: 15.00, imageUrl: 'https://picsum.photos/seed/queijo/400/300', description: 'Queijo fresco e saboroso, perfeito para lanches.' },
    { id: '5', name: 'Banana Prata (Kg)', price: 5.99, imageUrl: 'https://picsum.photos/seed/banana/400/300', description: 'Banana fresca e madura, rica em potássio.' },
    { id: '6', name: 'Refrigerante 2L', price: 8.00, imageUrl: 'https://picsum.photos/seed/refri/400/300', description: 'Para refrescar seus melhores momentos.' },
];


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<AppView>('products');

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: new Date().getTime().toString() };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  };
  
  const clearCart = () => setCart([]);

  const login = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'admin') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setView('products');
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const sendOrder = (checkoutData: CheckoutData) => {
    const marketPhoneNumber = '551138998270304'; // Substitua pelo número do mercado
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    let message = `*Novo Pedido - Jaci Supermercados*\n\n`;
    message += `*Itens:*\n`;
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `- ${item.quantity}x ${item.name}: R$ ${itemTotal.replace('.', ',')}\n`;
    });

    message += `\n*Total do Pedido: R$ ${total.replace('.', ',')}*\n\n`;
    message += `*Dados para Entrega:*\n`;
    message += `Nome: ${checkoutData.name}\n`;
    message += `Endereço: ${checkoutData.address}\n`;
    message += `Forma de Pagamento: ${checkoutData.paymentMethod}\n\n`;
    message += `Aguardando confirmação do pedido.`;
    
    const whatsappUrl = `https://wa.me/${marketPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setView('products');
  }

  const value = {
    products,
    cart,
    isAuthenticated,
    isCartOpen,
    view,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    login,
    logout,
    toggleCart,
    setView,
    sendOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};