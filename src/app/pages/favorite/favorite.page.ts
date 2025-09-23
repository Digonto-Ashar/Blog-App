// src/app/pages/favorite/favorite.page.ts
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FavoriteService } from '../../services/favorite';
import { ApiService } from '../../services/api';

@Component({
  standalone: false,
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  user$: Observable<any> = of(null); 
  favoritePosts$: Observable<any[]> = of([]); 

  constructor(
    private router: Router, // 2. Inject Router
    public api: ApiService, // Inject ApiService to use its baseUrl
    private authService: AuthService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
    this.favoritePosts$ = this.favoriteService.getFavorites();
  }
  openPost(postId: string) {
    // Navigate to the post details page using the post's ID
    this.router.navigate(['/tabs/home/post', postId]); 
  }

}
