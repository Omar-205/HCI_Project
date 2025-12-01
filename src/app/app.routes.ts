import { Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';
import { HomePage } from './components/home-page/home-page';
import { SignUp } from './components/sign-up/sign-up';
export const routes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: SignIn },
    { path: 'home', component: HomePage },
    { path: 'sign-up', component: SignUp }
];
