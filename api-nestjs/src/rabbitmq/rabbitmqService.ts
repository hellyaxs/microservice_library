import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';
import { rabbitMQProviderType } from './provider.rabbimq';
import { Message } from '@nestjs/microservices/external/kafka.interface';

@Injectable()
export class RabbitMQService {
  private readonly channel: Channel;
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitMQProvider: rabbitMQProviderType,
  ) {
    if (!this.channel) this.channel = this.rabbitMQProvider;
  }

  async sendMessage(queue: string, message: object) {
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async consumeMessage(queue: string, callback: (message: Message) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });
  }

  async createQueue(queue: string) {
    await this.channel.assertQueue(queue);
  }

  async createExchange(exchange: string) {
    await this.channel.assertExchange(exchange, 'direct');
  }

  async bindQueueToExchange(queue: string, exchange: string) {
    await this.channel.bindQueue(queue, exchange, '');
  }
}
