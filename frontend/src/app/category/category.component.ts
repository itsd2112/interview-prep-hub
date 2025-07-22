import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionsService, Question } from '../services/questions.service';

interface FilterOptions {
  tags: string[];
  difficulties: string[];
  searchQuery: string;
}

interface QuestionWithState extends Question {
  isExpanded: boolean;
  isBookmarked: boolean;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private questionsService = inject(QuestionsService);

  // State
  categoryId = signal<string>('');
  categoryName = signal<string>('');
  questions = signal<QuestionWithState[]>([]);
  filteredQuestions = signal<QuestionWithState[]>([]);
  isLoading = signal(true);
  isMobileFiltersOpen = signal(false);

  // Filters
  filters = signal<FilterOptions>({
    tags: [],
    difficulties: [],
    searchQuery: ''
  });

  // Available filter options
  availableTags = signal<string[]>([]);
  availableDifficulties = signal<string[]>(['Easy', 'Medium', 'Hard']);

  // UI State
  selectedTags = signal<string[]>([]);
  selectedDifficulties = signal<string[]>([]);
  searchQuery = signal<string>('');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = params['id'];
      this.categoryId.set(categoryId);
      this.setCategoryName(categoryId);
      this.loadQuestions(categoryId);
    });
  }

  private setCategoryName(categoryId: string): void {
    const categoryNames: { [key: string]: string } = {
      'frontend': 'Frontend Development',
      'backend': 'Backend Development',
      'data-structures': 'Data Structures',
      'algorithms': 'Algorithms',
      'system-design': 'System Design',
      'databases': 'Databases'
    };
    this.categoryName.set(categoryNames[categoryId] || 'Unknown Category');
  }

  private loadQuestions(categoryId: string): void {
    this.isLoading.set(true);
    
    // Mock data for demonstration - replace with actual API call
    const mockQuestions: Question[] = [
      {
        id: 1,
        question: "What is the difference between let, const, and var in JavaScript?",
        answer: "let and const are block-scoped, while var is function-scoped. const cannot be reassigned after declaration, while let and var can be. let and const have temporal dead zone, var doesn't."
      },
      {
        id: 2,
        question: "Explain the concept of closures in JavaScript",
        answer: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created."
      },
      {
        id: 3,
        question: "What is the Virtual DOM in React?",
        answer: "The Virtual DOM is a JavaScript representation of the actual DOM. React uses it to optimize rendering by comparing the virtual DOM with the previous version and only updating the parts that have changed."
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      const questionsWithState: QuestionWithState[] = mockQuestions.map(q => ({
        ...q,
        isExpanded: false,
        isBookmarked: false
      }));
      
      this.questions.set(questionsWithState);
      this.filteredQuestions.set(questionsWithState);
      this.extractAvailableTags(questionsWithState);
      this.isLoading.set(false);
    }, 1000);
  }

  private extractAvailableTags(questions: QuestionWithState[]): void {
    // Mock tags - in real app, extract from questions
    const tags = ['JavaScript', 'React', 'Angular', 'TypeScript', 'HTML', 'CSS', 'ES6', 'Async/Await'];
    this.availableTags.set(tags);
  }

  toggleQuestion(questionId: number): void {
    this.questions.update(questions => 
      questions.map(q => 
        q.id === questionId ? { ...q, isExpanded: !q.isExpanded } : q
      )
    );
    this.applyFilters();
  }

  toggleBookmark(questionId: number): void {
    this.questions.update(questions => 
      questions.map(q => 
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
      )
    );
    this.applyFilters();
  }

  onTagToggle(tag: string): void {
    this.selectedTags.update(tags => {
      const newTags = tags.includes(tag) 
        ? tags.filter(t => t !== tag)
        : [...tags, tag];
      return newTags;
    });
    this.applyFilters();
  }

  onDifficultyToggle(difficulty: string): void {
    this.selectedDifficulties.update(difficulties => {
      const newDifficulties = difficulties.includes(difficulty)
        ? difficulties.filter(d => d !== difficulty)
        : [...difficulties, difficulty];
      return newDifficulties;
    });
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const query = this.searchQuery().toLowerCase();
    const selectedTags = this.selectedTags();
    const selectedDifficulties = this.selectedDifficulties();

    this.filteredQuestions.set(
      this.questions().filter(question => {
        // Search filter
        const matchesSearch = !query || 
          question.question.toLowerCase().includes(query) ||
          question.answer.toLowerCase().includes(query);

        // Tag filter (mock implementation)
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => question.question.toLowerCase().includes(tag.toLowerCase()));

        // Difficulty filter (mock implementation)
        const matchesDifficulty = selectedDifficulties.length === 0 || 
          selectedDifficulties.includes('Medium'); // Mock all as Medium

        return matchesSearch && matchesTags && matchesDifficulty;
      })
    );
  }

  clearAllFilters(): void {
    this.selectedTags.set([]);
    this.selectedDifficulties.set([]);
    this.searchQuery.set('');
    this.applyFilters();
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen.update(open => !open);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getActiveFiltersCount(): number {
    return this.selectedTags().length + this.selectedDifficulties().length + 
           (this.searchQuery() ? 1 : 0);
  }

  trackByQuestion(index: number, question: QuestionWithState): number {
    return question.id;
  }
}
