export interface ProgramGoal {
  id: string;
  index: number;
  goalName: string;
  aboutId: string;
}

export interface ProgramAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  programId: string;
}

export interface Program {
  id: string;
  pageId: string;
  pageTitle: string;
  slug: string;
  aboutId: string;
  about: string;
  mission: string;
  vision: string;
  goals: ProgramGoal[];
  programAttachments: ProgramAttachment[];
}
