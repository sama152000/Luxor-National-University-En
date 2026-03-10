import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeanSpeechService } from '../../../Services/dean-speech.service';
import { DeanSpeech } from '../../../model/dean-speech.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule,CleanHtmlPipe],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, AfterViewInit {
  deanSpeech: DeanSpeech | null = null;
  isLoading = true;
  hasError = false;

  constructor(private deanSpeechService: DeanSpeechService) {}

  ngOnInit(): void {
    this.loadDeanSpeech();
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations
    this.initScrollAnimations();
    
    // Add stagger animation delays
    this.addAnimationDelays();
  }

  /** تحميل خطاب العميد */
  private loadDeanSpeech(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.deanSpeechService.getMainDeanSpeech().subscribe({
      next: (speech) => {
        this.deanSpeech = speech || null;
        this.isLoading = false;
        console.log('Dean Speech loaded:', this.deanSpeech);
        
        // Add animation class after data loads
        setTimeout(() => this.triggerAnimation(), 100);
      },
      error: (err) => {
        console.error('Error fetching dean speech', err);
        this.hasError = true;
        this.isLoading = false;
        // Still trigger animation to show fallback content
        setTimeout(() => this.triggerAnimation(), 100);
      }
    });
  }

  /** Trigger scroll animation */
  private triggerAnimation(): void {
    const book = document.querySelector('.book');
    if (book) {
      book.classList.add('in-view');
    }
  }

  /**
   * Initialize Intersection Observer for scroll animations
   */
  private initScrollAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              
              // Add staggered animations to child elements
              const children = entry.target.querySelectorAll('.page-content, .page-image-container, .right-page h3, .video-container, .page-features');
              children.forEach((child, index) => {
                (child as HTMLElement).style.animationDelay = `${index * 0.15}s`;
                child.classList.add('animate-child');
              });
              
              // Stop observing once animated
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      animatedElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      animatedElements.forEach((el) => {
        el.classList.add('in-view');
      });
    }
  }

  /**
   * Add animation delays to child elements for staggered effects
   */
  private addAnimationDelays(): void {
    // Add delays to header elements
    const header = document.querySelector('.section-header');
    if (header) {
      header.classList.add('animated');
    }

    // Add delays to book pages
    const leftPage = document.querySelector('.left-page');
    const rightPage = document.querySelector('.right-page');
    
    if (leftPage) {
      const imageContainer = leftPage.querySelector('.page-image-container');
      const content = leftPage.querySelector('.page-content');
      
      if (imageContainer) {
        (imageContainer as HTMLElement).style.animationDelay = '0.3s';
      }
      if (content) {
        (content as HTMLElement).style.animationDelay = '0.5s';
      }
    }

    if (rightPage) {
      const title = rightPage.querySelector('h3');
      const video = rightPage.querySelector('.video-container');
      const features = rightPage.querySelector('.page-features');
      
      if (title) {
        (title as HTMLElement).style.animationDelay = '0.4s';
      }
      if (video) {
        (video as HTMLElement).style.animationDelay = '0.6s';
      }
      if (features) {
        (features as HTMLElement).style.animationDelay = '0.8s';
      }
    }
  }

  /**
   * Add parallax effect on mouse move for desktop
   */
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const book = document.querySelector('.book') as HTMLElement;
    if (!book) return;

    const rect = book.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (event.clientX - centerX) / rect.width;
    const mouseY = (event.clientY - centerY) / rect.height;

    const leftPage = book.querySelector('.left-page') as HTMLElement;
    const rightPage = book.querySelector('.right-page') as HTMLElement;

    if (leftPage && rightPage) {
      // Subtle parallax effect
      const rotateX = mouseY * 2;
      const rotateY = mouseX * 2;

      book.style.transform = `perspective(2500px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  /**
   * Reset book position when mouse leaves
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    const book = document.querySelector('.book') as HTMLElement;
    if (!book) return;

    book.style.transition = 'transform 0.5s ease';
    book.style.transform = 'perspective(2500px) rotateX(0) rotateY(0)';
  }

  /**
   * Handle window resize
   */
  @HostListener('window:resize')
  onResize(): void {
    // Reset any inline styles on resize
    const book = document.querySelector('.book') as HTMLElement;
    if (book) {
      book.style.transform = '';
      book.style.transition = '';
    }
  }
}
