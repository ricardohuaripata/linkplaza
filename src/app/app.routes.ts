import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Welcome | LinkPlaza',
    component: HomeComponent,
  },
  {
    title: 'Sign in | LinkPlaza',
    path: 'auth/signin',
    component: SignInComponent,
  },
  {
    title: 'Sign up | LinkPlaza',
    path: 'auth/signup',
    component: SignUpComponent,
  },
  {
    title: 'Not found | LinkPlaza',
    path: '**',
    component: NotFoundComponent,
  },
];
