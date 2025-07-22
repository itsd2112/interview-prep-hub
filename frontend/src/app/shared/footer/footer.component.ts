import { Component, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  constructor(private sanitizer: DomSanitizer) {}
  
  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
  
  socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: 'github',
      color: '#333'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin',
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
      color: '#1da1f2'
    }
  ];

  quickLinks = [
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Privacy Policy', url: '/privacy' },
    { name: 'Terms of Service', url: '/terms' }
  ];

  categories = [
    { name: 'Frontend', url: '/category/frontend' },
    { name: 'Backend', url: '/category/backend' },
    { name: 'Data Structures', url: '/category/datastructures' },
    { name: 'System Design', url: '/category/systemdesign' }
  ];
}
