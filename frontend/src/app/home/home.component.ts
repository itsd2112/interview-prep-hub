import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuestionsService, type Question } from '../services/questions.service';
import { FooterComponent } from '../shared/footer/footer.component';

type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

interface CategoryCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  tags: string[];
  difficulty: DifficultyLevel;
}

// Category configuration - could be moved to a separate file if it grows large
const CATEGORIES_CONFIG: Omit<CategoryCard, 'questionCount'>[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    description: 'React, Angular, Vue.js, HTML, CSS, and JavaScript fundamentals',
    icon: '🎨',
    color: '#0ea5e9',
    tags: ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript'],
    difficulty: 'Medium',
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Node.js, Python, Java, databases, and server-side concepts',
    icon: '⚙️',
    color: '#22c55e',
    tags: ['Node.js', 'Python', 'Java', 'SQL', 'APIs'],
    difficulty: 'Hard',
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, and fundamental concepts',
    icon: '🏗️',
    color: '#f59e0b',
    tags: ['Arrays', 'Trees', 'Graphs', 'Hash Tables'],
    difficulty: 'Medium',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Sorting, searching, dynamic programming, and problem-solving',
    icon: '🧮',
    color: '#ef4444',
    tags: ['Sorting', 'Searching', 'DP', 'Recursion'],
    difficulty: 'Hard',
  },
  {
    id: 'system-design',
    name: 'System Design',
    description: 'Scalability, architecture patterns, and distributed systems',
    icon: '🏛️',
    color: '#8b5cf6',
    tags: ['Scalability', 'Architecture', 'Microservices'],
    difficulty: 'Hard',
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'SQL, NoSQL, database design, and optimization techniques',
    icon: '🗄️',
    color: '#06b6d4',
    tags: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL'],
    difficulty: 'Medium',
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Injected services
  private readonly router = inject(Router);
  private readonly questionsService = inject(QuestionsService);
  
  // State
  private subscription = new Subscription();
  readonly categories = signal<CategoryCard[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly totalQuestions = signal<number>(0);

  ngOnInit(): void {
    this.initializeCategories();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Initialize categories with default values
   */
  private initializeCategories(): void {
    this.categories.set(
      CATEGORIES_CONFIG.map(category => ({
        ...category,
        questionCount: 0, // Will be updated after loading
      }))
    );
  }

  /**
   * Load categories and their question counts from the API
   */
  private loadCategories(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const sub = this.questionsService.getCategories().subscribe({
      next: (apiCategories) => {
        this.updateCategoriesWithCounts(apiCategories);
        this.isLoading.set(false);
      },
      error: (error) => this.handleCategoryLoadError(error),
    });

    this.subscription.add(sub);
  }

  /**
   * Update categories with question counts from the API
   */
  private updateCategoriesWithCounts(apiCategories: string[]): void {
    const updatedCategories = this.categories().map(category => {
      const categoryName = category.id.toLowerCase();
      const hasCategory = apiCategories.some(apiCat => 
        apiCat.toLowerCase() === categoryName
      );
      
      // In a real app, we would fetch the actual count for each category
      const questionCount = hasCategory ? this.getRandomQuestionCount() : 0;
      
      return { ...category, questionCount };
    });
    
    this.categories.set(updatedCategories);
    this.updateTotalQuestions(updatedCategories);
  }

  /**
   * Calculate and update the total number of questions across all categories
   */
  private updateTotalQuestions(categories: CategoryCard[]): void {
    const total = categories.reduce((sum, cat) => sum + (cat.questionCount || 0), 0);
    this.totalQuestions.set(total);
  }

  /**
   * Handle errors when loading categories
   */
  private handleCategoryLoadError(error: Error): void {
    console.error('Error loading categories:', error);
    this.error.set('Failed to load categories. Please try again later.');
    this.isLoading.set(false);
  }

  /**
   * Navigate to the selected category
   */
  navigateToCategory(categoryId: string): void {
    if (!categoryId) {
      console.warn('Attempted to navigate with empty category ID');
      return;
    }
    
    this.router.navigate(['/category', categoryId.toLowerCase()])
      .catch(err => console.error('Navigation error:', err));
  }

  /**
   * Track categories by their ID for better ngFor performance
   */
  trackByCategoryId(index: number, category: CategoryCard): string {
    return category.id;
  }

  // Temporary method - replace with actual API call to get question count
  private getRandomQuestionCount(): number {
    return Math.floor(Math.random() * 50) + 10; // Random number between 10-60
  }

  /**
   * Get a category by its ID
   */
  private getCategoryById(id: string): CategoryCard | undefined {
    return this.categories().find(cat => cat.id === id);
  }

  /**
   * Get a category's data attribute for styling
   */
  getCategoryDataAttribute(categoryName: string): string {
    return categoryName.toLowerCase().replace(/\s+/g, '');
  }
}
