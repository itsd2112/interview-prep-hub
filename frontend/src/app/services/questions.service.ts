import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Question {
  id: number;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  lastUpdated?: Date;
}

type QuestionCategory = string;
type DifficultyLevel = 'easy' | 'medium' | 'hard';

const CACHE_SIZE = 1;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private categoriesCache$?: Observable<QuestionCategory[]>;
  private questionsCache = new Map<string, { timestamp: number; data: Observable<Question[]> }>();

  /**
   * Fetches all available question categories
   * Uses shareReplay to cache the result and avoid duplicate HTTP requests
   */
  getCategories(): Observable<QuestionCategory[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.http
        .get<QuestionCategory[]>(`${this.apiUrl}/categories`)
        .pipe(
          catchError(this.handleError<QuestionCategory[]>('getCategories', [])),
          shareReplay(CACHE_SIZE)
        );
    }
    return this.categoriesCache$;
  }

  /**
   * Fetches questions for a specific category
   * Implements caching with TTL to reduce server load
   */
  getQuestions(category: string, forceRefresh = false): Observable<Question[]> {
    const cacheKey = category.toLowerCase();
    const now = Date.now();
    const cached = this.questionsCache.get(cacheKey);

    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_TTL_MS) {
      return cached.data;
    }

    const request$ = this.http
      .get<Question[]>(`${this.apiUrl}/questions/${encodeURIComponent(category)}`)
      .pipe(
        map((questions: any[]) => questions.map((question: any) => ({
          ...question,
          id: question['_id'], // Map _id to id for frontend compatibility
          // Ensure all required fields have default values if missing
          question: question.question || 'No question text',
          answer: question.answer || 'No answer provided',
          tags: question.tags || [],
          difficulty: question.difficulty || 'medium'
        }))),
        catchError(this.handleError<Question[]>(`getQuestions for category=${category}`, [])),
        shareReplay(CACHE_SIZE)
      );

    this.questionsCache.set(cacheKey, {
      timestamp: now,
      data: request$
    });

    return request$;
  }

  /**
   * Handles HTTP errors and provides user-friendly error messages
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `A client error occurred: ${error.error.message}`;
      } else if (error.status) {
        // Server-side error
        errorMessage = `Server returned code ${error.status}: ${error.statusText || ''}`;
      }
      
      // Return default value and let component handle the error
      return throwError(() => new Error(errorMessage));
    };
  }
}
