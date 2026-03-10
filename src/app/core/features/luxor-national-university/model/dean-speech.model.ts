export interface DeanSpeechAttachment {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
}

export interface DeanSpeech {
  id: string;
  memberId: string;
  memberName: string;
  memberPosition: string;
  speech: string; // HTML string
  deanSpeechAttachments: DeanSpeechAttachment[];
}
