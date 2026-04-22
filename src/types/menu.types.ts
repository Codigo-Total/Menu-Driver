export interface Category {
  id: string;
  name: Record<string, string>; // { en: 'Drinks', es: 'Bebidas' }
  icon: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price: number;
  image: string;
  stock?: number;
  isPopular?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
