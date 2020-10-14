import {ProductModelServer} from "./product.model";

export interface CartModelServer {
  total: number;
  data: [{
    numInCart: number,
    product: ProductModelServer
  }]
}

export interface CartModelPublic {
  total: number;
  prodData: [{
    incart: number,
    id: number
  }]
}
