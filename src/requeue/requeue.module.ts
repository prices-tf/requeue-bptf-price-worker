import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PriceHistoryModule } from '../price-history/price-history.module';
import { PriceModule } from '../price/price.module';
import { RequeueService } from './requeue.service';

@Module({
  imports: [ConfigModule, PriceModule, PriceHistoryModule],
  providers: [RequeueService],
})
export class RequeueModule {}
