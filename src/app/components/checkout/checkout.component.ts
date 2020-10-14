import { CartModelServer } from './../../models/cart.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  cartTotal: number ;
  cartData: CartModelServer;
  shippingCharge: number = 100;

  constructor(private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  onCheckOut() {
    this.spinner.show();
    this.cartService.checkoutFromCart(2);
  }

}
