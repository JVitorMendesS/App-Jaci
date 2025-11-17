
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type AppView = 'products' | 'cart' | 'checkout' | 'login';

export interface CheckoutData {
  name: string;
  address: string;
  paymentMethod: 'Dinheiro' | 'Cartão' | 'PIX';
}