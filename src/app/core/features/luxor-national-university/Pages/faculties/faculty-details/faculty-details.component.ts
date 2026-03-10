import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from '../../../Services/faculty.service';
import { ProgramService } from '../../../Services/program.service';
import { MemberService } from '../../../Services/member.service';
import { Department, DepartmentDetail, DepartmentMember, DepartmentProgram } from '../../../model/faculty.model';
import { Program } from '../../../model/program.model';
import { Member } from '../../../model/member.model';
import { CleanHtmlPipe } from '../../../../../pipes/clean-html.pipe';

@Component({
  selector: 'app-faculty-details',
  standalone: true,
  imports: [CommonModule, CleanHtmlPipe],
  templateUrl: './faculty-details.component.html',
  styleUrls: ['./faculty-details.component.css']
})
export class FacultyDetailsComponent implements OnInit {
  faculty: any = null;
  isLoading = true;

  // Department Details
  departmentDetails: DepartmentDetail[] = [];

  // Slider
  currentImageIndex = 0;

  // Tabs
  aboutSections: any[] = [];
  activeAboutSectionId: string | null = null;

  // Programs
  programs: DepartmentProgram[] = [];
  currentProgramsPage = 1;
  programsPerPage = 6;
  totalProgramsPages = 1;
  paginatedPrograms: DepartmentProgram[] = [];

  // Staff
  staff: DepartmentMember[] = [];
  private membersMap: Map<string, Member> = new Map();
  currentStaffPage = 1;
  staffPerPage = 6;
  totalStaffPages = 1;
  paginatedStaff: DepartmentMember[] = [];

  // Modals
  showProgramModal = false;
  selectedProgram: DepartmentProgram | null = null;
  selectedProgramDetails: Program | null = null;
  activeProgramTabId = 'overview';
  programTabs = [
    { id: 'overview', title: 'عن البرنامج', icon: 'pi pi-info-circle' },
    { id: 'vision', title: 'الرؤية', icon: 'pi pi-eye' },
    { id: 'mission', title: 'الرسالة', icon: 'pi pi-bullseye' },
    { id: 'goals', title: 'الأهداف', icon: 'pi pi-check-circle' },
  ];

  showStaffModal = false;
  selectedStaff: DepartmentMember | null = null;
  selectedMemberDetails: Member | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private FacultyService: FacultyService,
    private ProgramService: ProgramService,
    private MemberService: MemberService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadFaculty(slug);
      }
    });
  }

  /** تحميل بيانات الكلية */
  loadFaculty(slug: string): void {
    this.isLoading = true;

    this.FacultyService.getAllDepartments().subscribe(departments => {
      const dep = departments.find(d => d.slug === slug);
      if (dep) {
        this.faculty = {
          ...dep,
          fullDescription: dep.about,
          dean: '', // هنجيبها من أعضاء القسم
          images: dep.departmentAttachments.map(a => a.url)
        };

        // Tabs عن الكلية
        this.aboutSections = [
          { id: 'about', title: 'عن القسم', icon: 'pi pi-info-circle', content: dep.about },
          { id: 'vision', title: 'الرؤية', icon: 'pi pi-eye', content: dep.vision },
          { id: 'mission', title: 'الرسالة', icon: 'pi pi-bullseye', content: dep.mission },
          { id: 'goals', title: 'الأهداف', icon: 'pi pi-check-circle', content: dep.goals.map(g => g.goalName).join('<br>') }
        ];
        this.activeAboutSectionId = 'about';

        // برامج القسم
        this.FacultyService.getDepartmentPrograms().subscribe(programs => {
          this.programs = programs.filter(p => p.departmentId === dep.id);
          this.updateProgramsPagination();
        });

        // أعضاء القسم
        this.MemberService.getAllMembers().subscribe(allMembers => {
          // Store full member details in map
          allMembers.forEach(member => {
            this.membersMap.set(member.id, member);
          });
          
          this.FacultyService.getDepartmentMembers().subscribe(members => {
            this.staff = members.filter(m => m.departmentId === dep.id);
            const leader = this.staff.find(m => m.isLeader);
            if (leader) this.faculty.dean = leader.memberName;
            this.updateStaffPagination();
          });
        });

        // تفاصيل القسم
        this.FacultyService.getDepartmentDetails().subscribe(details => {
          this.departmentDetails = details.filter(d => d.departmentId === dep.id);
          // إضافة بيانات التفاصيل للـ faculty
          if (this.departmentDetails.length > 0) {
            this.faculty.departmentTitle = this.departmentDetails[0].title;
            this.faculty.departmentContent = this.departmentDetails[0].content;
          }
        });
      }
      this.isLoading = false;
    });
  }

  // Slider Methods
  nextImage(): void {
    if (this.faculty && this.faculty.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.faculty.images.length;
    }
  }

  previousImage(): void {
    if (this.faculty && this.faculty.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.faculty.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  getCurrentImage(): string {
    return this.faculty?.images?.[this.currentImageIndex] || '';
  }

  hasMultipleImages(): boolean {
    return (this.faculty?.images?.length || 0) > 1;
  }

  // About Section Methods
  setActiveAboutSection(sectionId: string): void {
    this.activeAboutSectionId = sectionId;
  }

  isActiveAboutSection(sectionId: string): boolean {
    return this.activeAboutSectionId === sectionId;
  }

  getAboutContent(): string {
    const section = this.aboutSections.find(s => s.id === this.activeAboutSectionId);
    return section ? section.content : '';
  }

  // Programs Pagination
  updateProgramsPagination(): void {
    this.totalProgramsPages = Math.ceil(this.programs.length / this.programsPerPage);
    this.updatePaginatedPrograms();
  }

  updatePaginatedPrograms(): void {
    const startIndex = (this.currentProgramsPage - 1) * this.programsPerPage;
    const endIndex = startIndex + this.programsPerPage;
    this.paginatedPrograms = this.programs.slice(startIndex, endIndex);
  }

  goToProgramsPage(page: number): void {
    if (page >= 1 && page <= this.totalProgramsPages) {
      this.currentProgramsPage = page;
      this.updatePaginatedPrograms();
    }
  }

  previousProgramsPage(): void {
    if (this.currentProgramsPage > 1) {
      this.goToProgramsPage(this.currentProgramsPage - 1);
    }
  }

  nextProgramsPage(): void {
    if (this.currentProgramsPage < this.totalProgramsPages) {
      this.goToProgramsPage(this.currentProgramsPage + 1);
    }
  }

  getProgramsPageNumbers(): number[] {
    return Array.from({ length: this.totalProgramsPages }, (_, i) => i + 1);
  }

  // Staff Pagination
  updateStaffPagination(): void {
    this.totalStaffPages = Math.ceil(this.staff.length / this.staffPerPage);
    this.updatePaginatedStaff();
  }

  updatePaginatedStaff(): void {
    const startIndex = (this.currentStaffPage - 1) * this.staffPerPage;
    const endIndex = startIndex + this.staffPerPage;
    this.paginatedStaff = this.staff.slice(startIndex, endIndex);
  }

  goToStaffPage(page: number): void {
    if (page >= 1 && page <= this.totalStaffPages) {
      this.currentStaffPage = page;
      this.updatePaginatedStaff();
    }
  }

  previousStaffPage(): void {
    if (this.currentStaffPage > 1) {
      this.goToStaffPage(this.currentStaffPage - 1);
    }
  }

  nextStaffPage(): void {
    if (this.currentStaffPage < this.totalStaffPages) {
      this.goToStaffPage(this.currentStaffPage + 1);
    }
  }

  getStaffPageNumbers(): number[] {
    return Array.from({ length: this.totalStaffPages }, (_, i) => i + 1);
  }

  // Modal Methods
  openProgramModal(program: DepartmentProgram): void {
    this.selectedProgram = program;
    this.showProgramModal = true;
    document.body.style.overflow = 'hidden';
    
    // Load full program details
    if (program.programId) {
      this.ProgramService.getProgramById(program.programId).subscribe(fullProgram => {
        this.selectedProgramDetails = fullProgram || null;
      });
    }
  }

  closeProgramModal(): void {
    this.showProgramModal = false;
    this.selectedProgram = null;
    this.selectedProgramDetails = null;
    this.activeProgramTabId = 'overview';
    document.body.style.overflow = 'auto';
  }

  setActiveProgramTab(tabId: string): void {
    this.activeProgramTabId = tabId;
  }

  isActiveProgramTab(tabId: string): boolean {
    return this.activeProgramTabId === tabId;
  }

  openStaffModal(staffMember: DepartmentMember): void {
    this.selectedStaff = staffMember;
    this.showStaffModal = true;
    document.body.style.overflow = 'hidden';
    
    // Load full member details
    if (staffMember.memberId) {
      this.MemberService.getMemberById(staffMember.memberId).subscribe(fullMember => {
        this.selectedMemberDetails = fullMember || null;
      });
    }
  }

  closeStaffModal(): void {
    this.showStaffModal = false;
    this.selectedStaff = null;
    this.selectedMemberDetails = null;
    document.body.style.overflow = 'auto';
  }

  // Navigation
  goBack(): void {
    this.router.navigate(['/faculties']);
  }

  /** Get member image URL by member ID */
  getMemberImage(memberId: string): string {
    const member = this.membersMap.get(memberId);
    if (member && member.memberAttachments && member.memberAttachments.length > 0) {
      return member.memberAttachments[0].url;
    }
    return '';
  }
}
