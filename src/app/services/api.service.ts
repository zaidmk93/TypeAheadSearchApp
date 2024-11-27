import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private API_URL = '/api/search.json';

    constructor(private http: HttpClient) {}

    search(query: string, page: number = 1): Observable<any> {
      const params = new HttpParams()
        .set('title', query)
        .set('page', page.toString());
    
      return this.http.get<any>(`${this.API_URL}`, { params }).pipe(
        map(response => response.docs)
      );
    }
    
}
