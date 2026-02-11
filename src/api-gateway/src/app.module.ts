import { Module } from '@nestjs/common';
import { LivrosModule } from './livros/livros.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmprestimoModule } from './emprestimo/emprestimo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmprestimoModule,
    UsuariosModule,
    PagamentoModule,
    LivrosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
