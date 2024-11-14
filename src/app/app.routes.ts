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
    path: 'admin',
    title: 'Welcome | LinkPlaza',
    component: HomeComponent,
  },
  {
    path: 'auth/signin',
    title: 'Sign in | LinkPlaza',
    component: SignInComponent,
  },
  {
    path: 'auth/signup',
    title: 'Sign up | LinkPlaza',
    component: SignUpComponent,
  },
  {
    path: '**',
    title: 'Not found | LinkPlaza',
    component: NotFoundComponent,
  },
];
