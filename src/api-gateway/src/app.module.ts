import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { EmprestimoModule } from './modules/emprestimo/emprestimo.module';
import { LivrosModule } from './modules/books/livros.module';
import { PagamentoModule } from './modules/pagamento/pagamento.module';
import { UsuariosModule } from './modules/users/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    EmprestimoModule,
    UsuariosModule,
    PagamentoModule,
    LivrosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
