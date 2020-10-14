import { CartService } from './../../services/cart.service';
import { CartModelServer } from './../../models/cart.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: CartModelServer;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.cartService.cartData$.subscribe(data => this.cartData = data);

  }

}
