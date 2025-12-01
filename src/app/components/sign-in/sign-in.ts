import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Router } from '@angular/router';
import { HomePage } from "../home-page/home-page";

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, HomePage],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  constructor(private router: Router) {}
    onSignIn() {
    // Your sign-in logic here
    // After successful sign-in, navigate to home
    this.router.navigate(['/home']);
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
