import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../common/category';
import { environment } from '../environments/environment';

const categoryUrl = environment.authCategory;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCategories(): Observable< Category[]> {
    const headers = this.getHeaders();
    return this.httpClient.get< Category[]>(categoryUrl+'/', { headers });
  }

  getCategoryByCommerceId(id: number): Observable<Category[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(categoryUrl+'/commerce/'+id, { headers });
    
  }

  getCategoryById(id: number): Observable<Category> {
    const headers = this.getHeaders();
    return this.httpClient.get<any>(categoryUrl+'/'+id, { headers });
    
  }

  createCategory(category: any): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.post<any>(categoryUrl, category, { headers });
    
  }

  updateCategory(id: number, category: any): Observable<Category[]> {
    const headers = this.getHeaders();
    return this.httpClient.put<any>(categoryUrl+'/'+id, category, { headers });
  }

  deleteCategory(id: number): Observable<Category[]> {
    const headers = this.getHeaders();
    return this.httpClient.delete<any>(categoryUrl+'/'+id, { headers });
  }

}
