import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  create(dto: CreateDepartmentDto): Promise<Department> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
    } = query;

    const [data, total] = await this.repo.findAndCount({
      where: search
        ? {
            name: ILike(`%${search}%`),
          }
        : {},
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
    try {
      await this.repo.remove(department);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as QueryFailedError & { code?: string }).code === '23503'
      ) {
        throw new ConflictException(
          'Cannot delete this department: employees are still assigned to it. Reassign or remove them first.',
        );
      }
      this.logger.error(`Failed to delete department #${id}`, err as Error);
      throw err;
    }
  }
}
