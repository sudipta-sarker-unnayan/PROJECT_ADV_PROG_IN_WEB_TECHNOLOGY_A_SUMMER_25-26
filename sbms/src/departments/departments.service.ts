import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  create(dto: CreateDepartmentDto): Promise<Department> {
    return this.repo.save(this.repo.create(dto));
  }

  findAll(): Promise<Department[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.repo.findOne({ where: { id } });
    if (!department) throw new NotFoundException(`Department #${id} not found`);
    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    Object.assign(department, dto);
    return this.repo.save(department);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    await this.repo.remove(department);
  }
}
