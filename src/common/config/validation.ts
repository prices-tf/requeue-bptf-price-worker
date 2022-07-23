import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  INTERVAL_MINIMUM: Joi.number()
    .integer()
    .positive()
    .default(10 * 60 * 1000),
  INTERVAL_MAXIMUM: Joi.number()
    .integer()
    .positive()
    .default(2 * 24 * 60 * 60 * 1000),
  INTERVAL_DEFAULT: Joi.number()
    .integer()
    .positive()
    .default(24 * 60 * 60 * 1000),
  INTERVAL_ROUND_TO_CLOSEST: Joi.number()
    .integer()
    .positive()
    .default(10 * 60 * 1000),
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_USERNAME: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required(),
  RABBITMQ_VHOST: Joi.string().allow('').required(),
  RABBITMQ_PREFETCH_COUNT: Joi.number().positive().min(1).default(10),
  BPTF_PRICE_SERVICE_URL: Joi.string().required(),
  BPTF_PRICE_HISTORY_SERVICE_URL: Joi.string().required(),
});

export { validation };
