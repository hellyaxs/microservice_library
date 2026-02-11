import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppHttpService } from './httpService';
import { MicroservicesConfigService } from '../config/microservices.config';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AppHttpService, MicroservicesConfigService],
  exports: [AppHttpService, MicroservicesConfigService],
})
export class CommonModule {}
