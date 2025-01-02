import { TestBed } from '@angular/core/testing';

import { SharedComponentsService } from './shared-components.service';

describe('SharedComponentsService', () => {
  let service: SharedComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
