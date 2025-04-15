export class CreatedPersonEvent {
  id: string;
  PersonCreatedEvent: PersonCreatedEvent;
  constructor(PersonCreatedEvent: PersonCreatedEvent) {
    this.id = crypto.randomUUID();
    this.PersonCreatedEvent = PersonCreatedEvent;
  }
}

type Phones = {
  DDD: string;
  numero: string;
  type: string;
};

export type PersonCreatedEvent = {
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  phones: Phones[];
  cargo: string;
  endereco: string;
};
