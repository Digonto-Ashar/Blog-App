import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('highlightSlider') highlightSlider!: ElementRef;

  highlightedPosts: any[] = [];
  categories: any[] = [];
  latestPosts: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient, 
    public api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loadPageData();
  }

  trackByPostId(index: number, post: any): string {
    return post.id;
  }

  loadPageData() {
    this.isLoading = true;
    
    const posts$ = this.http.get<any>(`${this.api.baseUrl}/posts?limit=9&sort=-createdAt`);
    const categories$ = this.http.get<any>(`${this.api.baseUrl}/categories?limit=6`);

    forkJoin([posts$, categories$]).subscribe(
      ([postsData, categoryData]) => {
        this.highlightedPosts = postsData.docs;
        this.latestPosts = postsData.docs.slice(5, 9);
        this.categories = categoryData.docs;
        this.isLoading = false;

setTimeout(() => {
  if (this.highlightSlider?.nativeElement) {
    const swiperEl = this.highlightSlider.nativeElement;

    //swiper already exists!! destroy it to avoid duplicates

    if (swiperEl.swiper) {
      swiperEl.swiper.destroy(true, true);
    }
    swiperEl.initialize();
  }
}, 100); // A small delay ensures reliability.
      },
      (error) => {
        console.error('Error fetching page data:', error);
        this.isLoading = false;
      }
    );
  }

openPost(post: any) {
  // This is correct. It navigates from /tabs/home to /tabs/home/post/:id
  this.router.navigate(['post', post.id], { relativeTo: this.route });
}

openCategory(category: any) {

  this.router.navigate(['../category/posts', category.id], { relativeTo: this.route });
}

goToCategories() {
  // This navigates to the main category tab using an absolute path.
  this.router.navigate(['/tabs/category']);
}

}
