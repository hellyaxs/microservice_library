import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MicroserviceOptions {
  url: string;
  timeout: number;
}

@Injectable()
export class MicroservicesConfigService {
  constructor(private readonly config: ConfigService) {}

  get users(): MicroserviceOptions {
    return {
      url: this.config.get<string>('USERS_URL') ?? 'http://localhost:3000',
      timeout: parseInt(this.config.get<string>('USERS_TIMEOUT') ?? '5000', 10),
    };
  }

  get books(): MicroserviceOptions {
    return {
      url: this.config.get<string>('BOOKS_URL') ?? 'http://localhost:3001',
      timeout: parseInt(this.config.get<string>('BOOKS_TIMEOUT') ?? '5000', 10),
    };
  }

  get lending(): MicroserviceOptions {
    return {
      url: this.config.get<string>('LENDING_URL') ?? 'http://localhost:3002',
      timeout: parseInt(this.config.get<string>('LENDING_TIMEOUT') ?? '5000', 10),
    };
  }

  get notifications(): MicroserviceOptions {
    return {
      url: this.config.get<string>('NOTIFICATIONS_URL') ?? 'http://localhost:3003',
      timeout: parseInt(this.config.get<string>('NOTIFICATIONS_TIMEOUT') ?? '5000', 10),
    };
  }
}
