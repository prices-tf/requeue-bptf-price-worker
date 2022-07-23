import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { Paginated } from '../common/interfaces/paginated.interface';
import { Price } from './interfaces/price.interface';

@Injectable()
export class PriceHistoryService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  // Function that returns the average time between each price history
  getAverageTimeDifference(history: Price[]): number {
    const timeDifferences = [];

    for (let i = 0; i < history.length - 1; i++) {
      const timeDifference =
        new Date(history[i].createdAt).getTime() -
        new Date(history[i + 1].createdAt).getTime();
      timeDifferences.push(timeDifference);
    }
    return timeDifferences.reduce((a, b) => a + b, 0) / timeDifferences.length;
  }

  getPriceHistory(
    sku: string,
    page = 1,
    limit = 100,
    order = 'DESC',
  ): Promise<Paginated<Price>> {
    const url = `${
      this.configService.get<Services>('services').priceHistory
    }/history/${sku}`;

    return new Promise((resolve, reject) => {
      this.httpService
        .get<any>(url, {
          params: {
            page,
            limit,
            order,
          },
        })
        .subscribe({
          next: (observer) => {
            resolve(observer.data);
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }
}
