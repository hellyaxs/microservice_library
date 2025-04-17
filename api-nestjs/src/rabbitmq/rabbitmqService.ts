import { Inject, Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib';
import { rabbitMQProviderType } from './provider.rabbimq';

@Injectable()
export class RabbitMQService {
  private channel: Channel;
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly rabbitMQProvider: rabbitMQProviderType,
  ) {
    this.init();
  }

  private async init() {
    if (!this.channel) this.channel = await this.rabbitMQProvider;
  }

  async sendMessage(queue: string, message: object) {
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async sendMessageToExchange(
    exchange: string,
    routingKey: string,
    message: object,
  ) {
    await this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
  }

  async consumeMessage(queue: string, callback: (message: Message) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    });
  }
  async createQueue(queue: string) {
    await this.channel.assertQueue(queue, {
      durable: true,
    });
  }

  async createExchange(exchange: string, type: ExchangeType) {
    await this.channel.assertExchange(exchange, type);
  }

  async bindQueueToExchange(
    queue: string,
    exchange: string,
    routingKey: string,
  ) {
    await this.channel.bindQueue(queue, exchange, routingKey);
  }
}

export type ExchangeType = 'direct' | 'topic' | 'headers' | 'fanout';
