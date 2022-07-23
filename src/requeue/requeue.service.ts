import {
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, IntervalConfig } from '../common/config/configuration';
import { Price } from '../price-history/interfaces/price.interface';
import { PriceHistoryService } from '../price-history/price-history.service';
import { PriceService } from '../price/price.service';

@Injectable()
export class RequeueService {
  private readonly logger = new Logger(RequeueService.name);

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly priceService: PriceService,
    private readonly priceHistoryService: PriceHistoryService,
  ) {}

  @RabbitSubscribe({
    exchange: 'bptf-price.updated',
    routingKey: '*',
    queue: 'requeueRepeatablePriceChecks',
    queueOptions: {
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
    errorHandler: requeueErrorHandler,
  })
  private async requeuePriceCheck(price: Price): Promise<void> {
    const sku = price.sku;

    // Get the 10 most recent price changes
    const history = await this.priceHistoryService.getPriceHistory(sku, 1, 10);
    const smallHistory = history.meta.itemCount < 2;

    const intervalConfig = this.configService.get<IntervalConfig>('interval');

    // Default interval
    let interval = intervalConfig.default;

    if (!smallHistory) {
      // We have enough price changes to calculate the average time difference
      const averageDifference =
        this.priceHistoryService.getAverageTimeDifference(history.items);

      // Round the time to the closest rounding step, making sure it is within the
      // minimum and maximum values
      interval = Math.min(
        intervalConfig.maximum,
        Math.max(
          intervalConfig.minimum,
          Math.floor(averageDifference / intervalConfig.roundToClosest) *
            intervalConfig.roundToClosest,
        ),
      );
    }

    // Remove repeating job if one is already made
    await this.priceService.removeRepeatingJob(sku);
    // Create new repeating job
    await this.priceService.createRepeatingJob(
      sku,
      interval,
      // Priotitize keys
      sku === '5021;6' ? 1 : undefined,
    );

    this.logger.log(
      'Enqueued ' + sku + ' with interval ' + interval / 60000 + ' minutes',
    );
  }
}
