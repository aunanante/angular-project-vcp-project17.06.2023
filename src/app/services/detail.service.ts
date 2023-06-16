import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detail } from '../common/detail';
import { environment } from '../environments/environment';

const detailUrl = environment.authDetail;

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(private httpClient: HttpClient) { }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getDetailByProductId(id: number): Observable<Detail[]> {

    const headers = this.getHeaders();
    return this.httpClient.get<any>(detailUrl+'/product/'+id, { headers })
    
  }

  getDetailById(id: number): Observable<Detail> {

    const headers = this.getHeaders();
    return this.httpClient.get<any>(detailUrl+'/'+id, { headers })
    
  }

  createDetail(detail: any): Observable<Detail[]> {

    const headers = this.getHeaders();
    return this.httpClient.post<any>(detailUrl, detail, { headers });
    
  }

  updateDetail(id: number, detail:any): Observable<Detail[]> {

    const headers = this.getHeaders();
    return this.httpClient.put<any>(detailUrl+'/'+id, detail, { headers });
  }

  deleteDetail(id: number): Observable<Detail[]> {

    const headers = this.getHeaders();
    return this.httpClient.delete<any>(detailUrl+'/'+id, { headers });
  }

}
