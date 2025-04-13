import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import {
  CreatedPersonEvent,
  PersonCreatedEvent,
} from './events/create_person.event';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.appService.getHello();
    return 'message sent';
  }

  @Post()
  createPerson(@Body() person: PersonCreatedEvent): string {
    const event = new CreatedPersonEvent(person);
    this.appService.handlePersonCreated(event);
    return 'message sent';
  }

  @Put()
  updatePerson(@Body() person: PersonCreatedEvent): string {
    const event = new CreatedPersonEvent(person);
    this.appService.handlePersonPut(event);
    return 'message sent';
  }

  @Delete()
  deletePerson(@Body() person: PersonCreatedEvent): string {
    const event = new CreatedPersonEvent(person);
    this.appService.handlePersondelete(event);
    return 'message sent';
  }
}
