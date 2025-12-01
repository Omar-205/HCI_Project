import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignIn } from "./sign-in/sign-in";
import { FormGroup,FormBuilder } from '@angular/forms';
import { SignUp } from "./sign-up/sign-up";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SignIn, SignUp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HCI_Project');
}
