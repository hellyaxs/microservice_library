import { PersonCreatedEvent } from './create_person.event';

export class ListPersonEvent {
  constructor(private readonly listPerons: PersonCreatedEvent[]) {}
}
