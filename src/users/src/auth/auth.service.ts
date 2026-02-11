import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TokenCacheService } from './token-cache.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenCache: TokenCacheService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    const tokenKey = crypto.createHash('sha256').update(token).digest('hex');
    const cached = await this.tokenCache.get(tokenKey);
    if (cached) return cached;
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const ttl = payload.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : 300;
      await this.tokenCache.set(tokenKey, payload, Math.min(ttl, 300));
      return payload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
