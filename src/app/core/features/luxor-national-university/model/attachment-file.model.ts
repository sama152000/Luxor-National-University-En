export interface AttachmentFile {
  id: string;
  fileName: string;
  isPublic: boolean;
  relativePath: string;
  folderName: string;
  url: string;
}

export interface AttachmentFileApiResponse {
  success: boolean;
  data: AttachmentFile[];
  message: string;
  errors: string[];
  statusCode: number;
  timestamp: string;
}
