import { ProductResponseModel } from './../../models/product.model';
import { Router } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {

  message: string;
  orderId: number;
  products: any[] = [];
  cartTotal: number

  constructor(private orderService: OrderService,
              private router: Router) {

                const navigation = this.router.getCurrentNavigation();
                const state = navigation.extras.state as {
                  message: string,
                  products: ProductResponseModel[],
                  orderId: number,
                  total: number
                };
                
                this.message = state.message;
                this.orderId = state.orderId;
                this.products = state.products;
                this.cartTotal = state.total;

              }

  ngOnInit(): void {
  }

}
