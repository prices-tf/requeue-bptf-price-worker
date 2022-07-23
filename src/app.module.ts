import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { validation } from './common/config/validation';
import { HealthModule } from './health/health.module';
import { RabbitMQWrapperModule } from './rabbitmq-wrapper/rabbitmq-wrapper.module';
import { PriceModule } from './price/price.module';
import { PriceHistoryModule } from './price-history/price-history.module';
import { RequeueModule } from './requeue/requeue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
      load: [configuration],
      validationSchema: validation,
    }),
    RabbitMQWrapperModule,
    HealthModule,
    PriceModule,
    PriceHistoryModule,
    RequeueModule,
  ],
})
export class AppModule {}
