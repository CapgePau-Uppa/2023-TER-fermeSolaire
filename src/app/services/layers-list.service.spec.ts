import { TestBed } from '@angular/core/testing';

import { LayersListService } from './layers-list.service';

describe('LayersListService', () => {
  let service: LayersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
