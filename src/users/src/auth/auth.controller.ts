import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    return this.authService.login(user);
  }

  @Public()
  @Post('validate')
  async validate(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: ValidateTokenDto,
  ) {
    let token: string | undefined;
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.slice(7);
    } else if (body?.token) {
      token = body.token;
    }
    if (!token) throw new UnauthorizedException('Token não informado');
    const payload = await this.authService.validateToken(token);
    return { sub: payload.sub, email: payload.email, role: payload.role, exp: payload.exp };
  }
}
