import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FacultyService } from '../../Services/faculty.service';
import { Department } from '../../model/faculty.model';
import { CleanHtmlPipe } from '../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule, CleanHtmlPipe],
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css']
})
export class FacultiesComponent implements OnInit {
  allFaculties: Department[] = [];
  filteredFaculties: Department[] = [];
  paginatedFaculties: Department[] = [];

  searchText: string = '';
  searchFilter: { searchText: string } = { searchText: '' };
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  isLoading = false;

  constructor(
    private facultyService: FacultyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  /** تحميل كل الكليات */
  loadFaculties(): void {
    this.isLoading = true;
    this.facultyService.getAllDepartments().subscribe(faculties => {
      this.allFaculties = faculties;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  /** تطبيق الفلترة */
  applyFilters(): void {
    let filtered = this.allFaculties;

    // فلترة بالبحث
    if (this.searchFilter.searchText.trim() !== '') {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(this.searchFilter.searchText.toLowerCase())
      );
    }

    this.filteredFaculties = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearchTextChange(): void {
    this.applyFilters();
  }

  /** Pagination */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredFaculties.length / this.itemsPerPage);
    this.updatePaginatedFaculties();
  }

  updatePaginatedFaculties(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFaculties = this.filteredFaculties.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedFaculties();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  /** فتح صفحة تفاصيل الكلية بالـ slug */
  viewFacultyDetails(slug: string): void {
    this.router.navigate(['/faculties', slug]);
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
}
