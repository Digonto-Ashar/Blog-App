// src/app/pages/category-posts/category-posts.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { forkJoin } from 'rxjs';


@Component({
  standalone: false,
  selector: 'app-category-posts',
  templateUrl: './category-posts.page.html',
  styleUrls: ['./category-posts.page.scss'],
})
export class CategoryPostsPage implements OnInit {
  category: any = null;
  posts: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      // Use forkJoin to get category details and posts at the same time
      const categoryDetails$ = this.http.get<any>(`${this.api.baseUrl}/categories/${categoryId}`);
      const categoryPosts$ = this.http.get<any>(`${this.api.baseUrl}/posts?where[categories][equals]=${categoryId}`);

      forkJoin([categoryDetails$, categoryPosts$]).subscribe(
        ([categoryData, postsData]) => {
          this.category = categoryData;
          this.posts = postsData.docs;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching category data:', error);
          this.isLoading = false;
        }
      );
    }
  }

  openPost(post: any) {
    this.router.navigate(['../../post', post.id], { relativeTo: this.route });
  }
}
