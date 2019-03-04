import { TestBed } from '@angular/core/testing';

import { SendTokenService } from './send-token.service';

describe('SendTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendTokenService = TestBed.get(SendTokenService);
    expect(service).toBeTruthy();
  });
});
