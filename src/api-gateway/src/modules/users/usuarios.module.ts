import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AppController } from './controller/app.controller';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [RabbitmqModule, CommonModule],
  providers: [AppService],
  controllers: [AppController],
})
export class UsuariosModule {}
