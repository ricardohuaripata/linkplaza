import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { PageComponent } from './pages/page/page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminPageComponent } from './pages/admin/views/admin-page/admin-page.component';
import { AdminAccountComponent } from './pages/admin/views/admin-account/admin-account.component';
import { AdminAnalyticsComponent } from './pages/admin/views/admin-analytics/admin-analytics.component';

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
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        title: 'Admin | LinkPlaza',
        component: AdminPageComponent,
      },
      {
        path: 'account',
        title: 'Account | LinkPlaza',
        component: AdminAccountComponent,
      },
      {
        path: 'analytics',
        title: 'Analytics | LinkPlaza',
        component: AdminAnalyticsComponent,
      },
    ],
  },
  {
    path: 'page/:url',
    component: PageComponent,
  },
  {
    path: '**',
    title: 'Not found | LinkPlaza',
    component: NotFoundComponent,
  },
];
