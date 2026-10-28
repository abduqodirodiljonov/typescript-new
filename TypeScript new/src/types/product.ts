export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  images: ProductImage[];
  created_at: string;
}
