import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionsService } from '../services/questions.service';
import { FooterComponent } from '../shared/footer/footer.component';

interface CategoryCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private questionsService = inject(QuestionsService);

  totalQuestions = signal(0);
  categories = signal<CategoryCard[]>([
    {
      id: 'frontend',
      name: 'Frontend Development',
      description: 'React, Angular, Vue.js, HTML, CSS, and JavaScript fundamentals',
      icon: '🎨',
      color: '#0ea5e9',
      questionCount: 45,
      tags: ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript'],
      difficulty: 'Medium'
    },
    {
      id: 'backend',
      name: 'Backend Development',
      description: 'Node.js, Python, Java, databases, and server-side concepts',
      icon: '⚙️',
      color: '#22c55e',
      questionCount: 38,
      tags: ['Node.js', 'Python', 'Java', 'SQL', 'APIs'],
      difficulty: 'Hard'
    },
    {
      id: 'data-structures',
      name: 'Data Structures',
      description: 'Arrays, linked lists, trees, graphs, and fundamental concepts',
      icon: '🏗️',
      color: '#f59e0b',
      questionCount: 52,
      tags: ['Arrays', 'Trees', 'Graphs', 'Hash Tables'],
      difficulty: 'Medium'
    },
    {
      id: 'algorithms',
      name: 'Algorithms',
      description: 'Sorting, searching, dynamic programming, and problem-solving',
      icon: '🧮',
      color: '#ef4444',
      questionCount: 41,
      tags: ['Sorting', 'Searching', 'DP', 'Recursion'],
      difficulty: 'Hard'
    },
    {
      id: 'system-design',
      name: 'System Design',
      description: 'Scalability, architecture patterns, and distributed systems',
      icon: '🏛️',
      color: '#8b5cf6',
      questionCount: 29,
      tags: ['Scalability', 'Architecture', 'Microservices'],
      difficulty: 'Hard'
    },
    {
      id: 'databases',
      name: 'Databases',
      description: 'SQL, NoSQL, database design, and optimization techniques',
      icon: '🗄️',
      color: '#06b6d4',
      questionCount: 33,
      tags: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL'],
      difficulty: 'Medium'
    }
  ]);

  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading.set(true);
    this.questionsService.getCategories().subscribe({
      next: (categoryIds) => {
        // Map category IDs to our CategoryCard interface
        const categories = categoryIds.map(id => {
          const name = this.getCategoryName(id);
          return {
            id,
            name,
            description: this.getCategoryDescription(id),
            icon: this.getCategoryIcon(id),
            color: this.getCategoryColor(id),
            questionCount: 0, // We don't have this info from the API
            tags: this.getCategoryTags(id),
            difficulty: this.getCategoryDifficulty(id)
          };
        });
        
        this.categories.set(categories);
        this.calculateTotalQuestions();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error.set('Failed to load categories. Please try again later.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  private getCategoryName(id: string): string {
    const names: {[key: string]: string} = {
      'frontend': 'Frontend Development',
      'backend': 'Backend Development',
      'data-structures': 'Data Structures',
      'algorithms': 'Algorithms',
      'system-design': 'System Design',
      'databases': 'Databases'
    };
    return names[id] || id.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private getCategoryDescription(id: string): string {
    const descriptions: {[key: string]: string} = {
      'frontend': 'React, Angular, Vue.js, HTML, CSS, and JavaScript fundamentals',
      'backend': 'Node.js, Express, Django, Spring Boot, and other backend technologies',
      'data-structures': 'Arrays, Linked Lists, Trees, Graphs, and other fundamental data structures',
      'algorithms': 'Sorting, Searching, Dynamic Programming, and other algorithm patterns',
      'system-design': 'Designing scalable and distributed systems',
      'databases': 'SQL, NoSQL, database design, and optimization'
    };
    return descriptions[id] || `Questions about ${this.getCategoryName(id).toLowerCase()}`;
  }

  private getCategoryTags(id: string): string[] {
    const tags: {[key: string]: string[]} = {
      'frontend': ['React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
      'backend': ['Node.js', 'Express', 'Django', 'Spring Boot', 'REST', 'GraphQL'],
      'data-structures': ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'],
      'algorithms': ['Sorting', 'Searching', 'DP', 'Recursion', 'Big O'],
      'system-design': ['Scalability', 'Load Balancing', 'Caching', 'Microservices'],
      'databases': ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Indexing']
    };
    return tags[id] || [];
  }

  private calculateTotalQuestions(): void {
    const total = this.categories().reduce((sum, category) => sum + category.questionCount, 0);
    this.totalQuestions.set(total);
  }

  private getCategoryIcon(categoryId: string): string {
    const icons: {[key: string]: string} = {
      'frontend': '🎨',
      'backend': '⚙️',
      'data-structures': '📊',
      'algorithms': '🧮',
      'system-design': '🏗️',
      'databases': '💾'
    };
    return icons[categoryId] || '📚';
  }

  private getCategoryColor(categoryId: string): string {
    const colors: {[key: string]: string} = {
      'frontend': '#0ea5e9',
      'backend': '#10b981',
      'data-structures': '#8b5cf6',
      'algorithms': '#ec4899',
      'system-design': '#f59e0b',
      'databases': '#6366f1'
    };
    return colors[categoryId] || '#6b7280';
  }

  private getCategoryDifficulty(categoryId: string): 'Easy' | 'Medium' | 'Hard' {
    const difficulties: {[key: string]: 'Easy' | 'Medium' | 'Hard'} = {
      'frontend': 'Medium',
      'backend': 'Medium',
      'data-structures': 'Hard',
      'algorithms': 'Hard',
      'system-design': 'Hard',
      'databases': 'Medium'
    };
    return difficulties[categoryId] || 'Medium';
  }

  getCategoryDataAttribute(categoryName: string): string {
    return categoryName.toLowerCase().replace(/\s+/g, '');
  }

  navigateToCategory(category: CategoryCard): void {
    this.router.navigate(['/category', category.id]);
  }

  trackByCategory(index: number, category: CategoryCard): string {
    return category.id;
  }
}
