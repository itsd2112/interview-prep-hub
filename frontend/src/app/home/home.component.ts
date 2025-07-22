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

  ngOnInit(): void {
    this.calculateTotalQuestions();
  }

  private calculateTotalQuestions(): void {
    const total = this.categories().reduce((sum, category) => sum + category.questionCount, 0);
    this.totalQuestions.set(total);
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
