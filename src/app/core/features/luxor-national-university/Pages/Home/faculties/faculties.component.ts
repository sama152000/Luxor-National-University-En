import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FacultyService } from '../../../Services/faculty.service';
import { Department } from '../../../model/faculty.model';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faculties.component.html',

  styleUrl: './faculties.component.css'
})
export class FacultiesComponent implements OnInit {
  departments: Department[] = [];

  constructor(
    private facultyService: FacultyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.facultyService.get4Departments().subscribe(departments => {
      this.departments = departments;
    });
  }

  /** Navigate to faculty details */
  viewFacultyDetails(slug: string): void {
    this.router.navigate(['/faculties', slug]);
  }
}