export interface Config {
  port: number;
  interval: IntervalConfig;
  rabbitmq: RabbitMQConfig;
  services: Services;
}

export interface IntervalConfig {
  /**
   * Minimum interval in milliseconds
   */
  minimum: number;
  /**
   * Maximum interval in milliseconds
   */
  maximum: number;
  /**
   * Default interval in milliseconds
   */
  default: number;
  /**
   * Interval step in milliseconds
   */
  roundToClosest: number;
}

export interface RabbitMQConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
  prefetchCount: number;
}

export interface Services {
  prices: string;
  priceHistory: string;
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    interval: {
      minimum: parseInt(process.env.INTERVAL_MINIMUM, 10),
      maximum: parseInt(process.env.INTERVAL_MAXIMUM, 10),
      default: parseInt(process.env.INTERVAL_DEFAULT, 10),
      roundToClosest: parseInt(process.env.INTERVAL_ROUND_TO_CLOSEST, 10),
    },
    rabbitmq: {
      host: process.env.RABBITMQ_HOST,
      port: parseInt(process.env.RABBITMQ_PORT, 10),
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      vhost: process.env.RABBITMQ_VHOST,
      prefetchCount: parseInt(process.env.RABBITMQ_PREFETCH_COUNT, 10),
    },
    services: {
      prices: process.env.BPTF_PRICE_SERVICE_URL,
      priceHistory: process.env.BPTF_PRICE_HISTORY_SERVICE_URL,
    },
  };
};
