import { TestBed } from '@angular/core/testing';

import { MeetingConfigService } from './meeting-config.service';

describe('MeetingConfigService', () => {
  let service: MeetingConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
