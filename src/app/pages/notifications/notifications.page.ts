import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    public api: ApiService, // Make public to access in the template
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    const url = `${this.api.baseUrl}/posts?limit=15&sort=-publishedAt&depth=2`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.notifications = data.docs;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigates to the post when a notification is tapped.
   * @param post The post object from the notification.
   */
  goToPost(post: any) {
    this.router.navigate(['/tabs/home/post', post.id]);
  }

  /**
   * A pull-to-refresh handler to reload the notifications.
   * @param event The refresher event.
   */
  handleRefresh(event: any) {
    this.loadNotifications();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
