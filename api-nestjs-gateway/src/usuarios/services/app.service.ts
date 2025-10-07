import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmqService';

@Injectable()
export class AppService {
  constructor(private readonly rabbitmq: RabbitMQService) {
    this.rabbitmq.createQueue('person_created');
    this.rabbitmq.createQueue('person_deleted');
    this.rabbitmq.createQueue('person_updated');
    this.rabbitmq.createExchange('person', 'topic');

    this.rabbitmq.bindQueueToExchange('person_created', 'person', 'created');
    this.rabbitmq.bindQueueToExchange('person_deleted', 'person', 'deleted');
    this.rabbitmq.bindQueueToExchange('person_updated', 'person', 'updated');
  }

  handlePersonCreated(data: any) {
    this.rabbitmq.sendMessage('person_created', data);
  }

  handlePersondelete(data: any) {
    this.rabbitmq.sendMessage('person_deleted', data);
  }

  handlePersonPut(data: any) {
    this.rabbitmq.sendMessage('person_updated', data);
  }

  getHello(): string {
    this.rabbitmq.sendMessageToExchange('person', 'created', {
      data: 'heelos',
    });
    return 'Hello World!';
  }
}
