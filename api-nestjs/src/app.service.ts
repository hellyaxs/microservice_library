import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  handlePersonCreated(data: any) {
    this.client.emit('person_created', data);
  }

  handlePersondelete(data: any) {
    this.client.emit('person_deleted', data);
  }

  handlePersonPut(data: any) {
    this.client.emit('person_updated', data);
  }

  getHello(): string {
    this.client.emit('person_created', { data: 'heelos' });
    return 'Hello World!';
  }
}
