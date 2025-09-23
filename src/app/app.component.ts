// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { Observable } from 'rxjs';
import { ApiService } from './services/api';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // Create a public observable for the user state
  public user$: Observable<any>;

  public appPages = [
    { title: 'Home', url: '/tabs/home', icon: 'home' },
    { title: 'Categories', url: '/tabs/category', icon: 'grid' },
    { title: 'Favorites', url: '/tabs/favorite', icon: 'heart' },
    { title: 'Search', url: '/tabs/search', icon: 'search' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public api: ApiService
  ) {
    // Connect our local observable to the one in the service
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      // Redirect to the home page after logout
      this.router.navigate(['/tabs/home']);
    });
  }
}
