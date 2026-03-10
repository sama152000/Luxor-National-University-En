import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../Services/stats.service';
import { Stat } from '../../../model/stats.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy {
  @ViewChildren('counterElement') counterElements!: QueryList<ElementRef>;
  
  stats: Stat[] = [];
  private observer!: IntersectionObserver;
  private hasAnimated = false;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getAllStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.setupIntersectionObserver();
      },
      error: (err) => console.error('Error fetching stats', err)
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe the stats section
    setTimeout(() => {
      const statsElement = document.querySelector('.stats-section');
      if (statsElement) {
        this.observer.observe(statsElement);
      }
    }, 100);
  }

  animateCounters() {
    this.counterElements.forEach((element) => {
      const target = parseInt(element.nativeElement.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.nativeElement.textContent = Math.floor(current).toLocaleString();
      }, 16);
    });
  }
}
