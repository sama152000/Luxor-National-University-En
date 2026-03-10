export interface MemberAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
  memberId: string;
}

export interface Member {
  id: string;
  isPresident: boolean;
  fullName: string;
  position: string;
  specialization: string;
  pageId: string;
  memberType: string; // ممكن تكون "Other" أو "Department" أو "Program"
  memberAttachments: MemberAttachment[];
}
