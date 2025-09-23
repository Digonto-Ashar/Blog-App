import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // 1. Import HttpClient
import { Observable } from 'rxjs'; // 2. Import Observable
import { map } from 'rxjs/operators'; // 3. Import the map operator

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'https://payload-cms-blog-website-qrdy.vercel.app/api';

  constructor(private http: HttpClient) { } 

  // This is a new method for fetching multiple posts by an array of IDs
  getPostsByIds(ids: string[]): Observable<any[]> {
    if (!ids || ids.length === 0) {
      return new Observable(observer => observer.next([]));
    }
    const query = ids.map((id, index) => `where[or][${index}][id][equals]=${id}`).join('&');
    const url = `${this.baseUrl}/posts?${query}`;
    return this.http.get<any>(url).pipe(
      map(res => res.docs)
    );
  }

  // ... you can add any other API methods you have here ...
}
