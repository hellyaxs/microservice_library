import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/constants/roles';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(Role)
  role: Role;
}
