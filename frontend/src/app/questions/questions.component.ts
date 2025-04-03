import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsService, Question } from '../services/questions.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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

  constructor(private questionsService: QuestionsService,
    private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.questionsService.getQuestions().subscribe(data=>{
      this.questions.set(data);
    });

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result)=>{
      this.isMobile.set(result.matches);
    });
  }
}
