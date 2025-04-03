import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private apiUrl = 'http://localhost:8080/api/questions';
  private http = inject(HttpClient);

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }
}
