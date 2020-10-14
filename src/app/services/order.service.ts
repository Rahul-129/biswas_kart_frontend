import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { ProductResponseModel } from './../models/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: ProductResponseModel[] = [];
  private server_url = environment.server_url;

  constructor(private  _http: HttpClient) { }

  /* Get Single Order */

  getSingleOrder(orderId: number) {
    return this._http.get<ProductResponseModel>(this.server_url + "/orders/" + orderId).toPromise();
  }


}

