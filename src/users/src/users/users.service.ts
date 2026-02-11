import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email já cadastrado');
    const hash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const user = this.userRepository.create({
      email: dto.email,
      password: hash,
      role: dto.role,
    });
    const saved = await this.userRepository.save(user);
    return this.toResponse(saved);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((u) => this.toResponse(u));
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (dto.email !== undefined) {
      const existing = await this.findByEmail(dto.email);
      if (existing && existing.id !== id) throw new ConflictException('Email já cadastrado');
      user.email = dto.email;
    }
    if (dto.password !== undefined) {
      user.password = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    }
    if (dto.role !== undefined) user.role = dto.role;
    const saved = await this.userRepository.save(user);
    return this.toResponse(saved);
  }

  private toResponse(user: User): Omit<User, 'password'> {
    const { password: _, ...rest } = user;
    return rest;
  }
}
