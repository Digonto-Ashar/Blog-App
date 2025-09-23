import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      // Your API requires a password of at least 6 characters
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register(this.registerForm.value).subscribe(
      async () => {
        // On success, show a confirmation alert
        const alert = await this.alertController.create({
          header: 'Registration Successful',
          message: 'You can now log in with your new account.',
          buttons: ['OK'],
        });
        await alert.present();
        // Redirect the user to the login page
        this.router.navigateByUrl('/login'); 
      },
      async (error) => {
        // On failure, show an error alert
        const alert = await this.alertController.create({
          header: 'Registration Failed',
          message: error.error.message || 'An unknown error occurred. Please try again.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
