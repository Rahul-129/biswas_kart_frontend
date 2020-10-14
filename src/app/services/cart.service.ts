import { OrderResponse } from './../models/order.model';
import {ProductModelServer } from './../models/product.model';
import { CartModelPublic, CartModelServer } from './../models/cart.model';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { ProductService} from './product.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderService } from './order.service';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root'
  }

) export class CartService {

  private server_url = environment.server_url;

  /* Data Variable to Store Cart Information */
  private cartDataClient: CartModelPublic = {
    total: 0,
    prodData: [{
        incart: 0,
        id: 0
      }]
  };

  private cartDataServer: CartModelServer = {
    total: 0,
    data: [{
        numInCart: 0,
        product: undefined
      }]
  };

  /* Observable For The Components to Subscribe */
  cartTotal$ = new BehaviorSubject < number > (0);
  cartData$ = new BehaviorSubject < CartModelServer > (this.cartDataServer);


  constructor(private _http: HttpClient,
    private _productService: ProductService,
    private _orderService: OrderService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // Get The Information From Local Storage (if any)

    let info: CartModelPublic = JSON.parse(localStorage.getItem("cart"));

    // Check If The Info is Null or Has Some Value

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;

      this.cartDataClient.prodData.forEach(p => {
          this._productService.getSingleProduct(p.id).subscribe((productInfo: ProductModelServer) => {
              if (this.cartDataServer.data[0].numInCart === 0) {
                this.cartDataServer.data[0].numInCart = p.incart;
                this.cartDataServer.data[0].product = productInfo;
                this.calculateTotal();
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
              } else {
                this.cartDataServer.data.push({
                    numInCart: p.incart,
                    product: productInfo
                  }

                );
                this.calculateTotal();
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
              }

              this.cartData$.next({...this.cartDataServer});
            });
        });
    }
  }

  addProductToCart(id: number, quantity ? : number) {

    this._productService.getSingleProduct(id).subscribe(prod => {
        // If The Cart Is Empty

        if (this.cartDataServer.data[0].product === undefined) {
          this.cartDataServer.data[0].product = prod;
          this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
          this.calculateTotal();
          this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
          this.cartDataClient.prodData[0].id = prod.id;
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
          this.toast.success(`${prod.name} added to the cart`,"Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: "increasing",
            positionClass: "toast-bottom-center"
          });
        }
        // If The Cart Has Some Item    
        else {
          
          let index = this.cartDataServer.data.findIndex( p => p.product.id === prod.id);
          
          // If That Item Is Already In The Cart
          
          if (index !== -1) {
            if ( quantity !== undefined && quantity <= prod.quantity){
              this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity
            }
            else {
              this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity
            }

            this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
            this.toast.info(`${prod.name} quantity updated in the cart`,"Product Updated", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-bottom-center"
            });


          }
          // If That Item Is Not In The Cart
          else {
            this.cartDataServer.data.push({
              numInCart: 1,
              product: prod
            });

            this.cartDataClient.prodData.push({
              incart: 1,
              id: prod.id
            });

            this.toast.success(`${prod.name} added to the cart`,"Product Added", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-bottom-center"
            });
            
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
            this.cartData$.next({...this.cartDataServer});
          }
        }
    });
  }

  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart++;
      if (data.numInCart > data.product.quantity) {
        data.numInCart = data.product.quantity;
        this.toast.error("No more In Stock", "No Stock", {
          timeOut: 1500,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-bottom-center"
        });
      }
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartData$.next({...this.cartDataServer});
      localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
    }
    else {
      data.numInCart--;

      if (data.numInCart < 1) {
        this.deleteProductFromCart(index);
        this.cartData$.next({...this.cartDataServer});
      }
      else {
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
      }
    }
  }

  deleteProductFromCart(index: number) {
    let data = this.cartDataServer.data[index];
    if (window.confirm("Are you sure you want to remove this product?")) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      
      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {total: 0,prodData: [{incart: 0,id: 0}]};
        localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
      }
      else {
        localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {total: 0,data: [{numInCart: 0,product: undefined}]};
        this.cartData$.next({...this.cartDataServer});
      }
      else {
        this.cartData$.next({...this.cartDataServer});
      }
    }
    else {
      // If The User Clicks The Cancel Button
      return; 
    }
    this.toast.success(`${data.product.name} removed from cart`, "Item Removed", {
      timeOut: 1500,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-bottom-center"
    });
  }


  private calculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

   calculateSubTotal(index: number): number {
    let subTotal = 0;
    const p = this.cartDataServer.data[index];
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }

  checkoutFromCart(userId: number) {
    this._http.post(`${this.server_url}/orders/payment`, null).subscribe((res: {success: boolean}) => {
      if(res.success) {
        this.resetServerData();
        this._http.post(`${this.server_url}/orders/newOrder`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderResponse) => {

          this._orderService.getSingleOrder(data.order_id).then(prods => {

            if (data.success) {

              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              
              this.spinner.hide();
              this.router.navigate(["/thankyou"], navigationExtras).then(p => {
                this.cartDataClient = {total: 0,prodData: [{incart: 0,id: 0}]};
                this.cartTotal$.next(0);
                localStorage.setItem("cart", JSON.stringify(this.cartDataClient));
              });
            }
          });
        });
      } else {
        this.spinner.hide();
        this.router.navigateByUrl("/checkout").then();
        this.toast.error("Sorry, failed to order the product","Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: "increasing",
          positionClass: "toast-bottom-center"
        })
      }
    });
  }
  
  private resetServerData() {
    this.cartDataServer = {total: 0,data: [{numInCart: 0,product: undefined}]};
    this.cartData$.next({...this.cartDataServer});
  }

}
