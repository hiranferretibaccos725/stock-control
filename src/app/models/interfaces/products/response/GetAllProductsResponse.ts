export interface GetAllProductsResponse {
  id: string;
  name: string;
  amount: number;
  price: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
}
