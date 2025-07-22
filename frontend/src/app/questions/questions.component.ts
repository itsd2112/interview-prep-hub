import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsService, Question } from '../services/questions.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent implements OnInit {
  questions = signal<Question[]>([]);
  isMobile = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  category = signal<string>('');

  private questionsService = inject(QuestionsService);
  private breakpointObserver = inject(BreakpointObserver);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Set up responsive breakpoints
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
    });

    // Get category from route params
    this.route.params.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.category.set(category);
        this.loadQuestions(category);
      }
    });
  }

  private loadQuestions(category: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.questionsService.getQuestions(category).subscribe({
      next: (questions) => {
        this.questions.set(questions);
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.error.set('Failed to load questions. Please try again later.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
