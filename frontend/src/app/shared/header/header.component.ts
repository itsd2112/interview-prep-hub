import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);

  searchQuery = signal('');
  isMobileMenuOpen = signal(false);
  showCategoryDropdown = signal(false);
  categories = signal(['Frontend', 'Backend', 'Data Structures', 'Algorithms', 'System Design']);

  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery());
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
    this.showCategoryDropdown.set(false);
  }

  toggleCategoryDropdown(): void {
    this.showCategoryDropdown.update(show => !show);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Data Structures': '🏗️',
      'Algorithms': '🧮',
      'System Design': '🏛️'
    };
    return icons[category] || '📚';
  }
}
