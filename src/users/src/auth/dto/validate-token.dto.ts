import { IsOptional, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsOptional()
  @IsString()
  token?: string;
}
