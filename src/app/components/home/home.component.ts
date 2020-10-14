import { CartService } from './../../services/cart.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  products: any[] = [];

  constructor( private _productService: ProductService,
               private _cartService: CartService,
               private _router: Router) { }

  ngOnInit(): void {
    this._productService.getAllProducts().subscribe((prods: { count: number, products: any[]} )=>{
      this.products = prods.products;
    });
  }

  selectProduct(id: number) {
    this._router.navigate(['/product', id]).then();
  }

  addToCart(id: number) {
    this._cartService.addProductToCart(id);
  }

}
