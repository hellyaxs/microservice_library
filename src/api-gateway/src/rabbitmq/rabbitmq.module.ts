import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { rabbitmqProvider } from './provider.rabbimq';
import { RabbitMQService } from './rabbitmqService';

@Module({
  imports: [ConfigModule],
  providers: [rabbitmqProvider, RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitmqModule {}
