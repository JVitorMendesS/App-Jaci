// src/types.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category?: string;
  tags?: string[];
  unit_type: 'unit' | 'kg'; // definido no cadastro do admin
}

/**
 * Unidade escolhida pelo cliente no momento da compra
 */
export type UnitChoice = 'unit' | 'kg';

/**
 * Item do carrinho
 * Importante:
 * - selectedUnit define se o cliente comprou em unidade ou kg
 * - cartKey diferencia o mesmo produto vendido em unidades diferentes
 *   Ex: "banana:kg" e "banana:unit"
 */
export interface CartItem extends Product {
  quantity: number;
  selectedUnit: UnitChoice;
  cartKey: string;
}

/**
 * Views principais do app
 */
export type AppView = 'products' | 'checkout' | 'login';

/**
 * Dados do checkout (usados no envio do pedido)
 */
export interface CheckoutData {
  name: string;
  address: string;
  paymentMethod: string;
}
