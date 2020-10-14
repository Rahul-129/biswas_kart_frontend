export interface OrderResponse {
    order_id: number,
    success: boolean,
    message: string,
    products: [{
        id: number,
        numInCart: number
    }]
}