import { TestBed } from '@angular/core/testing';

import { GlicoseService } from './glicose.service';

describe('glicoseService', () => {
  let service: GlicoseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlicoseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});