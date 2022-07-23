import { Test, TestingModule } from '@nestjs/testing';
import { RequeueService } from './requeue.service';

describe('RequeueService', () => {
  let service: RequeueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RequeueService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RequeueService>(RequeueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
