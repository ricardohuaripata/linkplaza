import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NewPageComponent } from './pages/new-page/new-page.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Welcome | LinkPlaza',
    component: HomeComponent,
  },
  {
    path: 'signin',
    title: 'Sign in | LinkPlaza',
    component: SignInComponent,
  },
  {
    path: 'signup',
    title: 'Sign up | LinkPlaza',
    component: SignUpComponent,
  },
  {
    path: 'new-page',
    title: 'New page | LinkPlaza',
    component: NewPageComponent,
  },
  {
    path: '**',
    title: 'Not found | LinkPlaza',
    component: NotFoundComponent,
  },
];
