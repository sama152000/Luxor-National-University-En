/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LogosService } from './logos.service';

describe('Service: Logos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogosService]
    });
  });

  it('should ...', inject([LogosService], (service: LogosService) => {
    expect(service).toBeTruthy();
  }));
});
