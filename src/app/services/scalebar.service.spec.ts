import { TestBed } from '@angular/core/testing';

import { ScalebarService } from './scalebar.service';

describe('ScalebarService', () => {
  let service: ScalebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScalebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
