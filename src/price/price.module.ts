import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PriceService } from './price.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
