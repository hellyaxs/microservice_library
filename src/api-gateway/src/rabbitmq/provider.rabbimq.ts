import { ConfigService } from '@nestjs/config';
import { connect, Channel } from 'amqplib';

export const rabbitmqProvider = {
  provide: 'RABBITMQ_SERVICE',
  useFactory: async (configService: ConfigService): Promise<Channel> => {
    const connection = await connect(configService.get<string>('RABBITMQ_URL'));
    const channel = await connection.createChannel();
    return channel;
  },
  inject: [ConfigService],
};

export type rabbitMQProviderType = Promise<Channel>;
