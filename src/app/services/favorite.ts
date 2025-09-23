import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  // A BehaviorSubject to hold a Set of favorite post IDs for efficient lookups.
  private favoriteIds = new BehaviorSubject<Set<string>>(new Set());

  constructor(private api: ApiService) {
    // When the service starts, load any saved favorites from local storage.
    const savedFavorites = localStorage.getItem('my-favorites');
    if (savedFavorites) {
      this.favoriteIds.next(new Set(JSON.parse(savedFavorites)));
    }
  }

  getFavorites(): Observable<any[]> {
    return this.favoriteIds.asObservable().pipe(
      switchMap(ids => {
        const idsArray = Array.from(ids);
        if (idsArray.length === 0) {
          // If there are no favorites, return an empty array immediately.
          return new BehaviorSubject([]).asObservable();
        }
        // If there are favorites, fetch their full details from the API.
        return this.api.getPostsByIds(idsArray);
      })
    );
  }

  isFavorite(postId: string): Observable<boolean> {
    return new Observable(observer => {
      this.favoriteIds.subscribe(ids => {
        observer.next(ids.has(postId));
      });
    });
  }

  toggleFavorite(postId: string): void {
    const currentFavorites = this.favoriteIds.getValue();
    if (currentFavorites.has(postId)) {
      currentFavorites.delete(postId);
    } else {
      currentFavorites.add(postId);
    }
    this.favoriteIds.next(currentFavorites);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    const idsArray = Array.from(this.favoriteIds.getValue());
    localStorage.setItem('my-favorites', JSON.stringify(idsArray));
  }
}
