import { Module } from '@nestjs/common';
import { AppService } from './controller/app.service';
import { AppController } from './controller/app.controller';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  providers: [AppService],
  controllers: [AppController],
})
export class UsuariosModule {}
