/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttachmentFileService } from './attachment-file.service';

describe('Service: AttachmentFile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachmentFileService]
    });
  });

  it('should ...', inject([AttachmentFileService], (service: AttachmentFileService) => {
    expect(service).toBeTruthy();
  }));
});
