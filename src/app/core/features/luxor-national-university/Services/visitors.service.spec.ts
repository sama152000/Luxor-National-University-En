/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VisitorsService } from './visitors.service';

describe('Service: Visitors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisitorsService]
    });
  });

  it('should ...', inject([VisitorsService], (service: VisitorsService) => {
    expect(service).toBeTruthy();
  }));
});
