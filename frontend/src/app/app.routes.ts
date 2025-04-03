import { Routes } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component'

export const routes: Routes = [
    {path: '', component: QuestionsComponent }, // Default route
    { path: '**', redirectTo: '' } // Redirect unknown routes
];
