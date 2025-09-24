import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  standalone: false,
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  // This component will receive the post ID from its parent page
  @Input() postId!: string;
  comments: any[] = [];
  commentForm: FormGroup;
  isLoading = true;
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    public api: ApiService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Subscribe to the user observable to know if someone is logged in
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    if (this.postId) {
      this.loadComments();
    }
  }

  // Fetch comments specifically for this post
  loadComments() {
    this.isLoading = true;

    const url = `${this.api.baseUrl}/comments?where[post][equals]=${this.postId}&where[approved][equals]=true&depth=1&sort=-createdAt`;
    
    this.http.get<any>(url).subscribe(response => {
      this.comments = response.docs;
      this.isLoading = false;
    });
  }

  // Handle the submission of the new comment form
  submitComment() {
    console.log('Submit button clicked. Form status:', this.commentForm.status);
    
    if (this.commentForm.invalid) {
      console.log('Form is invalid. Cannot submit.');
      this.commentForm.markAllAsTouched(); 
      return;
    }

    if (!this.currentUser) {
      console.log('No user is currently logged in. Cannot submit.');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('Authentication Error: No token found. Cannot submit.');
      return;
    }
    
    console.log('Token found. Preparing to submit...');

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const payload = {
      post: this.postId,
      content: this.commentForm.value.content,
    };

    console.log('Submitting payload:', payload);

    this.http.post(`${this.api.baseUrl}/comments`, payload, { headers }).subscribe({
      next: (response) => {
        console.log('Comment submitted successfully!', response);
        this.commentForm.reset();
        this.loadComments(); 
      },
      error: (err) => {
        console.error('Error submitting comment:', err);
        // Here you could show an alert to the user that something went wrong.
      }
    });
  }
}
