import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const role = await this.rolesRepo.findOne({ where: { name: dto.role } });
    if (!role) {
      throw new NotFoundException(`Role '${dto.role}' not found — seed roles first`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role,
      status: UserStatus.ACTIVE,
    });
    return this.usersRepo.save(user);
  }

  async findAll(query: PaginationQueryDto): Promise<[User[], number]> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
    } = query;

    return this.usersRepo.findAndCount({
      where: search
        ? {
            name: ILike(`%${search}%`),
            email: ILike(`%${search}%`),
          }
        : {},
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.role) {
      const role = await this.rolesRepo.findOne({ where: { name: dto.role } });
      if (!role) throw new NotFoundException(`Role '${dto.role}' not found`);
      user.role = role;
    }
    Object.assign(user, {
      name: dto.name ?? user.name,
      email: dto.email ?? user.email,
    });
    return this.usersRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }

  async setStatus(id: number, status: UserStatus): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return this.usersRepo.save(user);
  }

  async resetPassword(id: number, newPassword: string): Promise<User> {
    const user = await this.findOne(id);
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    return this.usersRepo.save(user);
  }
}
