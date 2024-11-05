import { TestBed } from '@angular/core/testing';

import { PressaoService } from './pressao.service';

describe('PressaoService', () => {
  let service: PressaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PressaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});