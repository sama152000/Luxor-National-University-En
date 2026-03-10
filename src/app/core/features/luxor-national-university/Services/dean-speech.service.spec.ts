/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DeanSpeechService } from './dean-speech.service';

describe('Service: DeanSpeech', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeanSpeechService]
    });
  });

  it('should ...', inject([DeanSpeechService], (service: DeanSpeechService) => {
    expect(service).toBeTruthy();
  }));
});
