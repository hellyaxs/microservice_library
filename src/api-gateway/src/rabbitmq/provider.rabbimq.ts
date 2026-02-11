import { ConfigService } from '@nestjs/config';
import { connect, Channel } from 'amqplib';

function getRabbitMQUrl(config: ConfigService): string {
  const url = config.get<string>('RABBITMQ_URL');
  if (url && !url.includes('${')) return url;
  const user = config.get<string>('RABBITMQ_USER') ?? 'guest';
  const password = config.get<string>('RABBITMQ_PASSWORD') ?? 'guest';
  const host = config.get<string>('RABBITMQ_HOST') ?? 'localhost';
  const port = config.get<string>('RABBITMQ_PORT') ?? '5672';
  return `amqp://${user}:${password}@${host}:${port}`;
}

export const rabbitmqProvider = {
  provide: 'RABBITMQ_SERVICE',
  useFactory: async (configService: ConfigService): Promise<Channel> => {
    const connection = await connect(getRabbitMQUrl(configService));
    const channel = await connection.createChannel();
    return channel;
  },
  inject: [ConfigService],
};

export type rabbitMQProviderType = Promise<Channel>;
