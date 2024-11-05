import { TestBed } from '@angular/core/testing';

import { AnotacoesService } from './anotacoes.service';

describe('AnotacoesService', () => {
  let service: AnotacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnotacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
