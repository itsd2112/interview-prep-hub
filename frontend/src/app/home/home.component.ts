import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { QuestionsService } from '../services/questions.service';
import { FooterComponent } from '../shared/footer/footer.component';

type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

interface CategoryCard {
  id: string;
  name: string;        // Must match backend category name exactly
  displayName: string; // User-friendly display name
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  tags: string[];
  difficulty: DifficultyLevel;
}

// Category configuration - must match backend category names exactly in the 'name' field
// These categories must match exactly with the categories returned by the backend API
const CATEGORIES_CONFIG: Omit<CategoryCard, 'questionCount'>[] = [
  {
    id: 'frontend',
    name: 'Frontend',  // Must match backend exactly
    displayName: 'Frontend Development',
    description: 'React, Angular, Vue.js, HTML, CSS, and JavaScript fundamentals',
    icon: '🎨',
    color: '#0ea5e9',
    tags: ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript'],
    difficulty: 'Medium',
  },
  {
    id: 'backend',
    name: 'Backend',  // Must match backend exactly
    displayName: 'Backend Development',
    description: 'Node.js, Python, Java, databases, and server-side concepts',
    icon: '⚙️',
    color: '#22c55e',
    tags: ['Node.js', 'Python', 'Java', 'SQL', 'APIs'],
    difficulty: 'Hard',
  },
  {
    id: 'data-structures',
    name: 'Data Structures',  // Must match backend exactly (with space)
    displayName: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, and fundamental concepts',
    icon: '🏗️',
    color: '#f59e0b',
    tags: ['Arrays', 'Trees', 'Graphs', 'Hash Tables'],
    difficulty: 'Medium',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',  // Must match backend exactly
    displayName: 'Algorithms',
    description: 'Sorting, searching, dynamic programming, and problem-solving',
    icon: '🧮',
    color: '#ef4444',
    tags: ['Sorting', 'Searching', 'Dynamic Programming', 'Big O'],
    difficulty: 'Hard',
  }
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
    this.questionsService.getCategories().subscribe({
      next: (apiCategories) => {
        // First update with default counts
        this.updateCategoriesWithCounts(apiCategories);
        
        // Then fetch actual question counts for each category
        this.fetchCategoryQuestionCounts(apiCategories);
      },
      error: (error) => this.handleCategoryLoadError(error)
    });
  }
  
  // Fetch question counts for each category from the backend
  private fetchCategoryQuestionCounts(categoryNames: string[]): void {
    console.log('Fetching question counts for categories:', categoryNames);
    const updatedCategories = [...this.categories()];
    
    // Log the current state of categories before making requests
    console.log('Current categories in state:', 
      updatedCategories.map(c => `${c.name} (${c.displayName})`));
    
    // Create an array of observables for each category count request
    const countRequests = categoryNames.map((categoryName) => {
      console.log(`[${new Date().toISOString()}] Fetching questions for category: "${categoryName}"`);
      
      return this.questionsService.getQuestions(categoryName).pipe(
        map(questions => {
          console.log(`[${new Date().toISOString()}] Received ${questions.length} questions for "${categoryName}"`);
          return {
            categoryName,
            count: questions.length,
            questions // Include questions in the result for debugging
          };
        }),
        catchError((error) => {
          console.error(`[${new Date().toISOString()}] Error fetching questions for "${categoryName}":`, 
            error.status, error.message);
          return of({ 
            categoryName, 
            count: 0,
            questions: []
          });
        })
      );
    });
    
    // Wait for all requests to complete
    if (countRequests.length === 0) {
      console.warn('No category count requests to process');
      return;
    }
    
    console.log(`Starting ${countRequests.length} parallel requests to fetch question counts...`);
    
    forkJoin(countRequests).subscribe({
      next: (results) => {
        console.log(`[${new Date().toISOString()}] All ${results.length} category results received`);
        
        // Log all results for debugging
        results.forEach((result, index) => {
          if (!result) {
            console.warn(`Result at index ${index} is null or undefined`);
            return;
          }
          
          console.log(`[${index}] ${result.categoryName}: ${result.count} questions`);
        });
        
        // Process each result
        results.forEach((result, index) => {
          if (!result) {
            console.warn(`Skipping null result at index ${index}`);
            return;
          }
          
          console.log(`Processing result for "${result.categoryName}" (${result.count} questions)`);
          
          // Find the category that matches either by exact name or by displayName
          const categoryIndex = updatedCategories.findIndex(cat => {
            // Try exact match first
            if (cat.name === result.categoryName) {
              console.log(`  - Found exact name match: "${cat.name}" === "${result.categoryName}"`);
              return true;
            }
            
            // Try case-insensitive match
            if (cat.name.toLowerCase() === result.categoryName.toLowerCase()) {
              console.log(`  - Found case-insensitive name match: "${cat.name}" ~= "${result.categoryName}"`);
              return true;
            }
            
            // Try matching displayName as a fallback
            if (cat.displayName) {
              if (cat.displayName === result.categoryName) {
                console.log(`  - Found exact displayName match: "${cat.displayName}" === "${result.categoryName}"`);
                return true;
              }
              
              if (cat.displayName.toLowerCase() === result.categoryName.toLowerCase()) {
                console.log(`  - Found case-insensitive displayName match: "${cat.displayName}" ~= "${result.categoryName}"`);
                return true;
              }
            }
            
            return false;
          });
          
          if (categoryIndex !== -1) {
            const oldCount = updatedCategories[categoryIndex].questionCount;
            updatedCategories[categoryIndex] = {
              ...updatedCategories[categoryIndex],
              questionCount: result.count
            };
            console.log(`  - Updated "${result.categoryName}" count from ${oldCount} to ${result.count}`);
          } else {
            console.warn(`  - Could not find category: "${result.categoryName}" in current categories. Available categories:`, 
              updatedCategories.map(c => `"${c.name}"`).join(', '));
          }
        });
        
        // Log the final state before updating
        console.log('Final category counts before update:');
        updatedCategories.forEach((cat, idx) => {
          console.log(`  [${idx}] ${cat.name.padEnd(20)}: ${cat.questionCount} questions`);
        });
        
        // Update the categories with the new counts
        this.categories.set(updatedCategories);
        this.updateTotalQuestions(updatedCategories);
        
        console.log('Categories updated with new question counts');
      },
      error: (error) => {
        console.error('Error in fetchCategoryQuestionCounts:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url,
          statusText: error.statusText
        });
      },
      complete: () => {
        console.log('Completed fetching all question counts');
      }
    });
  }

  /**
   * Update categories with initial data
   */
  private updateCategoriesWithCounts(apiCategories: string[]): void {
    console.log('Updating categories with API categories:', apiCategories);
    
    const updatedCategories = CATEGORIES_CONFIG.map(category => {
      // Check if this category exists in the API response (case insensitive match)
      const matchingApiCategory = apiCategories.find(
        c => c.toLowerCase() === category.name.toLowerCase()
      );
      
      const hasCategory = !!matchingApiCategory;
      
      if (!hasCategory) {
        console.warn(`Category '${category.name}' not found in API response. Available categories:`, apiCategories);
      } else if (matchingApiCategory !== category.name) {
        console.log(`Category name case mismatch: '${category.name}' vs '${matchingApiCategory}'. Using configured name.`);
      }
      
      return {
        ...category,
        questionCount: 0 // Initialize with 0, will be updated by fetchCategoryQuestionCounts
      };
    });
    
    this.categories.set(updatedCategories);
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
