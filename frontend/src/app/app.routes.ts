import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Default route - Homepage
    { path: 'category/:id', component: CategoryComponent }, // Category detail view
    { path: '**', redirectTo: '' } // Redirect unknown routes
];
