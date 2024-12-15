import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent {
  loggedIn = false; 
  loginForm = false;

  toggleLogin() {
    this.loggedIn = !this.loggedIn; 
  }

  toggleLoginForm() {
    this.loginForm =!this.loginForm;
  }
  @Output() loginToggle = new EventEmitter<void>();

  onLoginClick() {
    this.loginToggle.emit();
  }

}
