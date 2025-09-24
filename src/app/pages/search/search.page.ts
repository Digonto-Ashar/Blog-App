import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { ApiService } from '../../services/api';

@Component({
  standalone: false,
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  searchTerm = '';
  searchResults: any[] = [];
  page = 1;
  isLoading = false;
  noResults = false;
  // Used to prevent multiple simultaneous requests
  private searchTimeout: any;

  constructor(
    private http: HttpClient,
    public api: ApiService,
    private router: Router
  ) {}

  // This function is called every time the user types in the search bar
  onSearchChange() {
    // Clear the previous timeout to avoid multiple rapid-fire searches
    clearTimeout(this.searchTimeout);

    // Set a new timeout. The search will only run after the user stops typing for 500ms.
    this.searchTimeout = setTimeout(() => {
      this.searchResults = [];
      this.page = 1;
      this.noResults = false;
      if (this.searchTerm.trim().length > 0) {
        this.searchPosts();
      }
    }, 500); // 500ms debounce time
  }

  // The main function to fetch posts from the API
  searchPosts(event?: any) {
    this.isLoading = true;

    // Construct the API query with a 'where' clause to filter by title
    const url = `${this.api.baseUrl}/posts?where[title][like]=${this.searchTerm}&depth=1&page=${this.page}&limit=10`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.searchResults = [...this.searchResults, ...data.docs];
        this.isLoading = false;
        this.noResults = this.searchResults.length === 0;

        // Complete the infinite scroll event if it exists
        if (event) {
          event.target.complete();
          // Disable infinite scroll if we've reached the last page
          if (this.page >= data.totalPages) {
            event.target.disabled = true;
          }
        }
        this.page++;
      },
      error: (err) => {
        console.error('Error during search:', err);
        this.isLoading = false;
      }
    });
  }

  // Triggered by the infinite scroll component
  loadMore(event: any) {
    this.searchPosts(event);
  }

  // Navigate to the post details page when a result is tapped
  goToPost(postId: string) {
    this.router.navigate(['/tabs/home/post', postId]);
  }
}
