import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { User } from '../users/entities/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly clientsRepo: Repository<Client>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
    if (user.role.name !== RoleName.CLIENT) {
      throw new BadRequestException(`User #${dto.userId} does not have the client role`);
    }

    const existing = await this.clientsRepo.findOne({ where: { user: { id: dto.userId } } });
    if (existing) throw new ConflictException(`User #${dto.userId} is already a client`);

    const client = this.clientsRepo.create({
      user,
      companyName: dto.companyName,
      phone: dto.phone,
    });
    return this.clientsRepo.save(client);
  }

  findAll(): Promise<Client[]> {
    return this.clientsRepo.find();
  }

  async findOne(id: number): Promise<Client> {
    return this.findClientOrFail(id);
  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findClientOrFail(id);
    Object.assign(client, {
      companyName: dto.companyName ?? client.companyName,
      phone: dto.phone ?? client.phone,
    });
    return this.clientsRepo.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findClientOrFail(id);
    await this.clientsRepo.remove(client);
  }

  private async findClientOrFail(id: number): Promise<Client> {
    const client = await this.clientsRepo.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Client #${id} not found`);
    return client;
  }
}