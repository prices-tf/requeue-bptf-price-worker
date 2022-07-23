import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config, RabbitMQConfig } from '../common/config/configuration';
import { RabbitMQService } from './rabbitmq-wrapper.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const rabbitmqConfig = configService.get<RabbitMQConfig>('rabbitmq');

        return {
          exchanges: [
            {
              name: 'bptf-price.updated',
              type: 'fanout',
            },
          ],
          uri: `amqp://${rabbitmqConfig.username}:${rabbitmqConfig.password}@${rabbitmqConfig.host}:${rabbitmqConfig.port}/${rabbitmqConfig.vhost}`,
          prefetchCount: rabbitmqConfig.prefetchCount,
          connectionInitOptions: { wait: false },
        };
      },
    }),
  ],
  exports: [RabbitMQModule],
  providers: [RabbitMQService],
})
export class RabbitMQWrapperModule {}
