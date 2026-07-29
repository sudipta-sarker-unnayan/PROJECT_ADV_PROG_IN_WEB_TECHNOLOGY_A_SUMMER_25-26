import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Manager } from './entities/manager.entity';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepo: Repository<Manager>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async getAll() {
    return this.managerRepo.find();
  }

  async getOne(id: number) {
    const manager = await this.managerRepo.findOne({
      where: { id },
    });

    if (!manager) {
      throw new BadRequestException('Manager not found');
    }

    return manager;
  }

  async createManager(dto: CreateManagerDto) {
    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const department = dto.departmentId
      ? await this.departmentRepo.findOne({
          where: { id: dto.departmentId },
        })
      : null;

    const manager = this.managerRepo.create({
      user,
      department: department ?? undefined,
    });

    return this.managerRepo.save(manager);
  }

  async updateManager(id: number, dto: UpdateManagerDto) {
    const manager = await this.getOne(id);

    Object.assign(manager, dto);

    return this.managerRepo.save(manager);
  }

  async deleteManager(id: number) {
    const result = await this.managerRepo.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException('Manager not found');
    }

    return {
      message: `Manager with id ${id} deleted successfully`,
    };
  }
}