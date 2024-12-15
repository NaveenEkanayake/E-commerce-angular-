import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'] // Corrected styleUrls
})
export class LoginFormComponent implements OnInit, OnDestroy {
  state: 'Login' | 'Signup' = 'Login';
  email = '';
  password = '';
  fullname = '';
  showForgotPassword = false;
  showLogin = true;

  // Lifecycle hook to block body scroll when form is open
  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  // Lifecycle hook to restore body scroll when form is closed
  ngOnDestroy(): void {
    document.body.style.overflow = 'unset';
  }

  // Method to toggle between Login and Signup
  toggleState() {
    this.state = this.state === 'Login' ? 'Signup' : 'Login';
  }

  // Method to toggle the Forgot Password view
  toggleForgotPassword() {
    this.showForgotPassword = true;
    this.showLogin = false;
  }

  // Method to close the login form
  closeLogin() {
    this.showLogin = false;
  }

  // Method to handle form submission
  onSubmit() {
    if (this.state === 'Login') {
      console.log('Logging in with:', this.email, this.password);
    } else {
      console.log('Signing up with:', this.fullname, this.email, this.password);
    }
  }

  resetPassword() {
    console.log('Resetting password for:', this.email);
  }
}
