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
    // Map URL-friendly IDs to display names and backend category names
    const categoryMap: { 
      [key: string]: { displayName: string, backendName: string } 
    } = {
      'frontend': { displayName: 'Frontend Development', backendName: 'Frontend' },
      'backend': { displayName: 'Backend Development', backendName: 'Backend' },
      'data-structures': { displayName: 'Data Structures', backendName: 'Data Structures' },
      'algorithms': { displayName: 'Algorithms', backendName: 'Algorithms' },
      'system-design': { displayName: 'System Design', backendName: 'System Design' },
      'databases': { displayName: 'Databases', backendName: 'Databases' }
    };

    const category = categoryMap[categoryId] || { displayName: 'Unknown Category', backendName: categoryId };
    this.categoryName.set(category.displayName);
    // Update the category ID to match the backend's expected format
    this.categoryId.set(category.backendName);
  }

  private loadQuestions(categoryId: string): void {
    this.isLoading.set(true);
    
    // Use the category ID that matches the backend's expected format
    const backendCategoryName = this.categoryId();
    
    console.log(`Fetching questions for category: ${backendCategoryName}`);
    
    this.questionsService.getQuestions(backendCategoryName).subscribe({
      next: (questions) => {
        console.log(`Received ${questions.length} questions`);
        const questionsWithState = questions.map(question => ({
          ...question,
          isExpanded: false,
          isBookmarked: false
        }));
        this.questions.set(questionsWithState);
        this.filteredQuestions.set(questionsWithState);
        this.extractAvailableTags(questionsWithState);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  private extractAvailableTags(questions: QuestionWithState[]): void {
    const allTags = new Set<string>();
    questions.forEach(question => {
      if (question.tags) {
        question.tags.forEach(tag => allTags.add(tag));
      }
    });
    this.availableTags.set(Array.from(allTags));
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
    const selectedDifficulties = this.selectedDifficulties().map(d => d.toLowerCase());

    this.filteredQuestions.set(
      this.questions().filter(question => {
        // Search filter
        const matchesSearch = !query || 
          question.question.toLowerCase().includes(query) ||
          question.answer.toLowerCase().includes(query);

        // Tag filter - check if question has any of the selected tags
        const matchesTags = selectedTags.length === 0 || 
          (question.tags && question.tags.some((tag: string) => 
            selectedTags.includes(tag.toLowerCase())
          ));

        // Difficulty filter - check if question matches any selected difficulty
        const matchesDifficulty = selectedDifficulties.length === 0 || 
          (question.difficulty && selectedDifficulties.includes(question.difficulty.toLowerCase()));

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

  /**
   * Format answer text with proper line breaks and formatting
   */
  formatAnswer(answer: string): string {
    if (!answer) return '';
    
    // Replace numbered lists with proper HTML
    let formatted = answer
      .replace(/\n\s*\d+\.\s+/g, '</li><li>') // Numbered lists
      .replace(/\n\s*[-*]\s+/g, '</li><li>') // Bullet points
      .replace(/\n\s*\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n\s*\*([^*]+)\*/g, '<em>$1</em>'); // Italic text
    
    // Add proper list tags if we found list items
    if (formatted.includes('<li>')) {
      formatted = `<ul><li>${formatted.replace(/<\/li><li>/, '')}</ul>`;
    }
    
    // Convert line breaks to <br> tags
    return formatted.replace(/\n/g, '<br>');
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      
      // Show copied indicator
      const button = event?.target as HTMLElement;
      if (button) {
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }

  /**
   * Share question using Web Share API
   */
  async shareQuestion(question: QuestionWithState): Promise<void> {
    const shareData = {
      title: question.question,
      text: question.answer.length > 100 
        ? `${question.answer.substring(0, 100)}...` 
        : question.answer,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await this.copyToClipboard(`${question.question}\n\n${question.answer}`);
        alert('Question copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing question:', err);
    }
  }
}
