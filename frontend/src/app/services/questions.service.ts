import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Question {
  id: number;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = `${environment.apiUrl}/questions`;
  private http = inject(HttpClient);

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/categories`);
  }

  getQuestions(category: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/questions/${category}`);
  }
}
