import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  standalone: false,
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  createPostForm: FormGroup;
  categories: any[] = [];
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the reactive form with validators
    this.createPostForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  // Fetch all available categories to populate the dropdown
  loadCategories() {
    this.http.get<any>(`${this.api.baseUrl}/categories`).subscribe(data => {
      this.categories = data.docs;
    });
  }

  // Store the selected file when the user chooses one
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Main function to handle form submission
  submitPost() {
    if (this.createPostForm.invalid) {
      return; // Stop if the form is invalid
    }
    this.isLoading = true;

    // If a file was selected, upload it first. Otherwise, proceed directly.
    if (this.selectedFile) {
      this.uploadImageAndCreatePost();
    } else {
      this.createPost(null); // Create post without a featured image
    }
  }

  // Step 1: Upload the image
  uploadImageAndCreatePost() {
    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Send the image to the /media endpoint
    this.http.post<any>(`${this.api.baseUrl}/media`, formData, { headers }).subscribe({
      next: (response) => {
        this.createPost(response.doc.id); // Proceed to step 2 with the new image ID
      },
      error: (err) => {
        console.error('Image upload failed', err);
        this.isLoading = false;
        // Optionally, show an alert to the user
      }
    });
  }

  // Step 2: Create the post
  createPost(imageId: string | null) {
    const formValue = this.createPostForm.value;

    // IMPORTANT: Convert the plain text content into the rich text JSON format
    const richTextContent = {
      root: {
        children: [{
          type: 'paragraph',
          children: [{ type: 'text', text: formValue.content }],
        }],
      },
    };

    const postData = {
      title: formValue.title,
      categories: [formValue.category],
      content: richTextContent,
      status: 'published',
      featuredImage: imageId, // This will be null if no image was uploaded
    };

    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Send the final post data to the /posts endpoint
    this.http.post(`${this.api.baseUrl}/posts`, postData, { headers }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tabs/home']); // Success! Navigate back to home.
        // Optionally, show a success toast message
      },
      error: (err) => {
        console.error('Post creation failed', err);
        this.isLoading = false;
        // Optionally, show an alert to the user
      }
    });
  }
}
