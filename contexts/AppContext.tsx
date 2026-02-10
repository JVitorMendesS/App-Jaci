import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Product, CartItem, AppView, CheckoutData } from '../types';
import { supabase } from '../supabaseClient';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  isAuthenticated: boolean;
  isCartOpen: boolean;
  view: AppView;
  loadingProducts: boolean;

  // true quando existir item de produto (kg) comprado em unidade (un)
  isTotalAConfirmar: boolean;

  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // 👇 agora aceita quantidade opcional + unidade escolhida (unit/kg)
  addToCart: (
    product: Product,
    quantity?: number,
    selectedUnit?: 'unit' | 'kg'
  ) => void;

  removeFromCart: (cartKey: string) => void;
  updateCartQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;

  login: (user: string, pass: string) => boolean;
  logout: () => void;

  toggleCart: () => void;
  setView: (view: AppView) => void;

  sendOrder: (checkoutData: CheckoutData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    'isAuthenticated',
    false
  );
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [view, setView] = useState<AppView>('products');

  // 🔄 Normaliza carrinho antigo (migração do localStorage) para não quebrar
  useEffect(() => {
    setCart((prev) =>
      prev.map((item: any) => {
        const hasKey =
          typeof item.cartKey === 'string' && item.cartKey.length > 0;
        const hasUnit = item.selectedUnit === 'unit' || item.selectedUnit === 'kg';

        if (hasKey && hasUnit) return item as CartItem;

        const fallbackUnit: 'unit' | 'kg' =
          item.unit_type === 'kg' ? 'kg' : 'unit';

        const selectedUnit: 'unit' | 'kg' =
          item.selectedUnit === 'unit' || item.selectedUnit === 'kg'
            ? item.selectedUnit
            : fallbackUnit;

        const cartKey = `${item.id}:${selectedUnit}`;

        return {
          ...item,
          selectedUnit,
          cartKey,
        } as CartItem;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        setLoadingProducts(false);
        return;
      }

      const mapped: Product[] =
        (data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          imageUrl: p.image_url,
          description: p.description ?? '',
          category: p.category ?? undefined,
          tags:
            typeof p.tags === 'string'
              ? p.tags
                  .split(',')
                  .map((t: string) => t.trim())
                  .filter(Boolean)
              : Array.isArray(p.tags)
              ? p.tags
              : undefined,
          unit_type: p.unit_type ?? 'unit',
        })) ?? [];

      setProducts(mapped);
      setLoadingProducts(false);
    };

    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        image_url: productData.imageUrl,
        description: productData.description,
        category: productData.category ?? null,
        tags:
          productData.tags && productData.tags.length
            ? productData.tags.join(',')
            : null,
        unit_type: productData.unit_type ?? 'unit',
      })
      .select('*')
      .single();

    if (error || !data) {
      console.error('Erro ao adicionar produto:', error);
      return;
    }

    const newProduct: Product = {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      imageUrl: data.image_url,
      description: data.description ?? '',
      category: data.category ?? undefined,
      tags:
        typeof data.tags === 'string'
          ? data.tags
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : Array.isArray(data.tags)
          ? data.tags
          : undefined,
      unit_type: data.unit_type ?? 'unit',
    };

    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = async (productData: Product) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        price: productData.price,
        image_url: productData.imageUrl,
        description: productData.description,
        category: productData.category ?? null,
        tags:
          productData.tags && productData.tags.length
            ? productData.tags.join(',')
            : null,
        unit_type: productData.unit_type ?? 'unit',
      })
      .eq('id', productData.id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productData.id ? productData : p))
    );
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedUnit?: 'unit' | 'kg'
  ) => {
    if (quantity <= 0) return;

    const unit: 'unit' | 'kg' =
      selectedUnit ?? (product.unit_type === 'kg' ? 'kg' : 'unit');

    // Se o produto é "unit", não permite entrar no carrinho como "kg"
    const safeUnit: 'unit' | 'kg' = product.unit_type === 'unit' ? 'unit' : unit;

    const cartKey = `${product.id}:${safeUnit}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);

      if (existing) {
        if (safeUnit === 'kg') {
          // Para kg, define a quantidade exata
          return prev.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity } : item
          );
        }

        // Para unidade, soma
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItem = {
        ...product,
        quantity,
        selectedUnit: safeUnit,
        cartKey,
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const updateCartQuantity = (cartKey: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.cartKey !== cartKey);
      }
      return prev.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'admin') {
      setIsAuthenticated(true);
      setView('products');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setView('products');
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const isTotalAConfirmar = cart.some(
    (item) => item.unit_type === 'kg' && item.selectedUnit === 'unit'
  );

  const sendOrder = (checkoutData: CheckoutData) => {
    const marketPhoneNumber = '553898792631';

    const total = cart
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);

    let message = `*Novo Pedido - Mercado do Jaci*\n\n`;
    message += `*Itens:*\n`;

    cart.forEach((item) => {
      const unitLabel = item.selectedUnit === 'kg' ? 'kg' : 'un';
      const qtyText =
        item.selectedUnit === 'kg'
          ? String(item.quantity).replace('.', ',')
          : String(Math.trunc(item.quantity));

      const itemIsAConferir =
        item.unit_type === 'kg' && item.selectedUnit === 'unit';

      if (itemIsAConferir) {
        message += `- ${qtyText} ${unitLabel} ${item.name}: *(a conferir)*\n`;
      } else {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `- ${qtyText} ${unitLabel} ${item.name}: R$ ${itemTotal.replace(
          '.',
          ','
        )}\n`;
      }
    });

    if (isTotalAConfirmar) {
      message += `\n*Total do Pedido: (a conferir)*\n`;
      message += `Seu pedido será conferido e em alguns minutos enviaremos o total.\n\n`;
    } else {
      message += `\n*Total do Pedido: R$ ${total.replace('.', ',')}*\n\n`;
    }

    message += `*Dados para Entrega:*\n`;
    message += `Nome: ${checkoutData.name}\n`;
    message += `Endereço: ${checkoutData.address}\n`;
    message += `Forma de Pagamento: ${checkoutData.paymentMethod}\n\n`;
    message += `Aguardando confirmação do pedido.`;

    const whatsappUrl = `https://wa.me/${marketPhoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');

    clearCart();
    setView('products');
  };

  const value: AppContextType = {
    products,
    cart,
    isAuthenticated,
    isCartOpen,
    view,
    loadingProducts,
    isTotalAConfirmar,
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export default AppProvider;
