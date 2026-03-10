//faculty.model.ts
export interface DepartmentGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

export interface DepartmentAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  isFeatured: boolean;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  subTitle: string;
  pageId: string;
  pageTitle: string;
  slug: string;
  aboutId: string;
  about: string;
  mission: string;
  vision: string;
  goals: DepartmentGoal[];
  departmentAttachments: DepartmentAttachment[];
}

export interface DepartmentDetail {
  id: string;
  title: string;
  content: string;
  departmentId: string;
  departmentName: string;
}

export interface DepartmentMember {
  id: string;
  isLeader: boolean;
  departmentId: string;
  departmentName: string;
  memberId: string;
  memberName: string;
}

export interface DepartmentProgram {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  programId: string;
  programName: string;
  slug: string;
}
