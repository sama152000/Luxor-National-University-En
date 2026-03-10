export interface JournalAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
}

export interface Journal {
  id: string;
  pubishedDate: string;   // تاريخ النشر
  title: string;          // عنوان المجلة
  description: string;    // وصف المجلة
  journalAttachments: JournalAttachment[];
}
