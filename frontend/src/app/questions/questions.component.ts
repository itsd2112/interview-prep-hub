import { Component, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsService, Question } from '../services/questions.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  // State signals
  questions = signal<Question[]>([]);
  isMobile = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  category = signal<string>('');

  // Subscriptions
  private breakpointSub?: Subscription;
  private paramsSub?: Subscription;
  private questionsSub?: Subscription;

  // Injected services
  private readonly questionsService = inject(QuestionsService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.setupResponsiveLayout();
    this.subscribeToRouteParams();
  }

  ngOnDestroy(): void {
    this.breakpointSub?.unsubscribe();
    this.paramsSub?.unsubscribe();
    this.questionsSub?.unsubscribe();
  }

  private setupResponsiveLayout(): void {
    this.breakpointSub = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(({ matches }) => this.isMobile.set(matches));
  }

  private subscribeToRouteParams(): void {
    this.paramsSub = this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        const category = params.get('category');
        if (category) {
          this.category.set(category);
          this.loadQuestions(category);
        } else {
          this.error.set('No category specified');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error with route params:', err);
        this.error.set('Error loading category');
        this.isLoading.set(false);
      }
    });
  }

  private loadQuestions(category: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.questionsSub = this.questionsService.getQuestions(category).subscribe({
      next: (questions) => this.questions.set(questions),
      error: (err) => {
        console.error('Error loading questions:', err);
        this.error.set('Failed to load questions. Please try again later.');
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
