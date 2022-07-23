import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';

@Injectable()
export class PriceService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  createRepeatingJob(
    sku: string,
    interval: number,
    priority?: number,
  ): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').prices
    }/prices/sku/${sku}/repeat`;

    return new Promise((resolve, reject) => {
      this.httpService
        .post<any>(url, {
          interval,
          priority,
        })
        .subscribe({
          next: () => {
            resolve();
          },
          error: (err) => {
            reject(err);
          },
        });
    });
  }

  removeRepeatingJob(sku: string): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').prices
    }/prices/sku/${sku}/repeat`;

    return new Promise((resolve, reject) => {
      this.httpService.delete<any>(url).subscribe({
        next: () => {
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
}
