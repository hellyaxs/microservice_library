import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../common/redis/redis.constants';
import { JwtPayload } from './auth.service';

const TOKEN_CACHE_PREFIX = 'token:valid:';
const TOKEN_CACHE_TTL_SEC = 300; // 5 min

@Injectable()
export class TokenCacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get(tokenKey: string): Promise<JwtPayload | null> {
    const raw = await this.redis.get(TOKEN_CACHE_PREFIX + tokenKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as JwtPayload;
    } catch {
      return null;
    }
  }

  async set(tokenKey: string, payload: JwtPayload, ttlSec = TOKEN_CACHE_TTL_SEC): Promise<void> {
    const key = TOKEN_CACHE_PREFIX + tokenKey;
    await this.redis.setex(key, ttlSec, JSON.stringify(payload));
  }
}
