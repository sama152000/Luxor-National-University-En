/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeroSectionsService } from './hero-sections.service';

describe('Service: HeroSections', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroSectionsService]
    });
  });

  it('should ...', inject([HeroSectionsService], (service: HeroSectionsService) => {
    expect(service).toBeTruthy();
  }));
});
