// src/app/pages/post-details/post-details.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { FavoriteService } from '../../services/favorite';
import { Observable, of } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  post: any = null;
  user$: Observable<any> = of(null); 
  isFavorite$: Observable<boolean> = of(false); 
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public api: ApiService,
    private authService: AuthService, 
    private favoriteService: FavoriteService 
  ) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
    const postId = this.route.snapshot.paramMap.get('id');

    if (postId) {
      // Use the new subscribe syntax with 'next' and 'error' handlers
      this.http.get<any>(`${this.api.baseUrl}/posts/${postId}?depth=1`).subscribe({
        next: (data) => {
          this.post = data;
          this.isLoading = false; // <-- THIS IS THE CRITICAL FIX
          this.isFavorite$ = this.favoriteService.isFavorite(postId);
        },
        error: (err) => {
          console.error('Failed to load post:', err);
          this.isLoading = false; // Also stop loading on error
        }
      });
    } else {
      this.isLoading = false; // Stop loading if there's no post ID
    }
  }

  toggleFavorite(): void {
    if (this.post) {
      this.favoriteService.toggleFavorite(this.post.id);
    }
  }

  serializeRichText(node: any): string {
    if (!node || !node.children) {
      return '';
    }
    return node.children.map((child: any) => {
      if (child.type === 'paragraph') {
        return `<p>${child.children.map((textNode: any) => textNode.text).join('')}</p>`;
      }
      if (child.text) {
        return child.text;
      }
      return '';
    }).join('');
  }
}
