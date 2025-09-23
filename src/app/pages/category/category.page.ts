import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.http.get<any>(`${this.api.baseUrl}/categories`).subscribe(
      (data) => {
        this.categories = data.docs;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false;
      }
    );
  }

openCategory(category: any) {
  // Use a more descriptive, relative path
  this.router.navigate(['posts', category.id], { relativeTo: this.route });
}

openPost(post: any) {
  // Use relative navigation
  this.router.navigate(['post', post.id], { relativeTo: this.route });
}
}
