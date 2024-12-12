import { TestBed } from '@angular/core/testing';

import { AnalyticService } from './analytic.service';

describe('AnalyticService', () => {
  let service: AnalyticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
