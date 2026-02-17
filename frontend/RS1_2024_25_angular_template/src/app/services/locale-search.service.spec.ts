import { TestBed } from '@angular/core/testing';

import { LocaleSearchService } from './locale-search.service';

describe('LocaleSearchService', () => {
  let service: LocaleSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocaleSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
