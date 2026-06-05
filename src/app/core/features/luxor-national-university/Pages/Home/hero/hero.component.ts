import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionsService } from '../../../Services/hero-sections.service';
import { HeroSection, HeroDot } from '../../../model/hero-section.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  slides: HeroSection[] = [];
  dots: HeroDot[] = [];
  currentSlideIndex = 0;
  animatingIndex = 0;
  slideInterval: any;

  constructor(private heroService: HeroSectionsService) {}

  ngOnInit() {
    this.heroService.getAllHeroSections().subscribe({
      next: (data) => {
        this.slides = data;
        this.dots = this.slides.map((s, i) => ({
          label: s.title,
          active: i === this.currentSlideIndex
        }));
        this.animatingIndex = this.currentSlideIndex;
        this.startSlideShow();
      },
      error: (err) => console.error('Error fetching hero sections', err)
    });
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  nextSlide() {
    if (this.slides.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      this.triggerAnimation();
      this.updateDots();
    }
  }

  switchSlide(index: number) {
    if (index === this.currentSlideIndex) return;
    this.currentSlideIndex = index;
    this.triggerAnimation();
    this.updateDots();

    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startSlideShow();
    }
  }

  triggerAnimation() {
    // Briefly remove the animating class so CSS animations replay on the new active slide
    this.animatingIndex = -1;
    setTimeout(() => {
      this.animatingIndex = this.currentSlideIndex;
    }, 50);
  }

  updateDots() {
    this.dots = this.dots.map((dot, i) => ({
      ...dot,
      active: i === this.currentSlideIndex
    }));
  }
}
