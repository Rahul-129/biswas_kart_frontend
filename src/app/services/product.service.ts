import { ProductModelServer, ServerResponse } from './../models/product.model';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private server_url = environment.server_url;


  constructor(private _http: HttpClient) { }

  /* Get all product from backend */
  getAllProducts( limitofResult: number = 12): Observable<ServerResponse> {
    return this._http.get<ServerResponse>(this.server_url + "/products", {
      params: {
        limit: limitofResult.toString()
      }
    });
  }

  /* Get Single Product From Backend */

  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this._http.get<ProductModelServer>(this.server_url + "/products/" + id);
  }

  /* Get Product From One Category */

  getProductFromCategory(catName: string): Observable<ProductModelServer> {
    return this._http.get<ProductModelServer>(this.server_url + "/products/category/" + catName);
  }




}
