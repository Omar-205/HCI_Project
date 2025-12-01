import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePage } from "./components/home-page/home-page";
import { SignIn } from "./components/sign-in/sign-in";

@Component({
  selector: 'app-root',
  imports: [HomePage, SignIn, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HCI_Project');
}
