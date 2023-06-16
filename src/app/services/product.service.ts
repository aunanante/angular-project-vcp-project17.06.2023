import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { environment } from '../environments/environment';

const productUrl = environment.authProduct;


@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllProducts(): Observable< Product[]> {
    const headers = this.getHeaders();
    return this.httpClient.get< Product[]>(productUrl+'/', { headers });
  }

  getProductByCategoryId(id: number): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(productUrl+'/category/'+id, { headers })
    
  }

  getProductById(id: number): Observable<Product> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(productUrl+'/'+id, { headers });
    
  }

  createProduct(product: any): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.httpClient.post<any>(productUrl, product, { headers });
    
  }

  updateProduct(id: number, product: any): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(productUrl+'/'+id, product, { headers });
  }

  deleteProduct(id: number): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.httpClient.delete<any>(productUrl+'/'+id, { headers });
  }

}
