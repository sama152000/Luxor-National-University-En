import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
   templateUrl: './loader.component.html',

  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {
  @Output() loadingComplete = new EventEmitter<void>();
  
  ngOnInit() {
    // Automatically emit loading complete after 3 seconds
    setTimeout(() => {
      this.loadingComplete.emit();
    }, 3000);
  }
}