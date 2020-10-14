export interface ProductModelServer {
  id: number;
  name: String;
  category: String;
  description: String;
  image: String;
  price: number;
  quantity: number;
  images: String;
}


export interface ServerResponse  {
  count: number;
  products: ProductModelServer[]
}


export interface ProductResponseModel{
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}
