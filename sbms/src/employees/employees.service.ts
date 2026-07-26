import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RoleName } from '../roles/entities/role.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly employeesRepo: Repository<Employee>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Department) private readonly departmentsRepo: Repository<Department>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
    if (user.role.name !== RoleName.EMPLOYEE) {
      throw new BadRequestException(`User #${dto.userId} does not have the employee role`);
    }

    const existing = await this.employeesRepo.findOne({ where: { user: { id: dto.userId } } });
    if (existing) throw new ConflictException(`User #${dto.userId} is already an employee`);

    const employee = this.employeesRepo.create({ user, designation: dto.designation, salary: dto.salary });

    if (dto.departmentId) {
      employee.department = await this.findDepartmentOrFail(dto.departmentId);
    }
    if (dto.managerId) {
      employee.manager = await this.findEmployeeOrFail(dto.managerId);
    }

    return this.employeesRepo.save(employee);
  }

  findAll(): Promise<Employee[]> {
    return this.employeesRepo.find();
  }

  async findOne(id: number): Promise<Employee> {
    return this.findEmployeeOrFail(id);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findEmployeeOrFail(id);

    if (dto.departmentId !== undefined) {
      employee.department = await this.findDepartmentOrFail(dto.departmentId);
    }
    if (dto.managerId !== undefined) {
      if (dto.managerId === id) {
        throw new BadRequestException('An employee cannot be their own manager');
      }
      employee.manager = await this.findEmployeeOrFail(dto.managerId);
    }

    Object.assign(employee, {
      designation: dto.designation ?? employee.designation,
      salary: dto.salary ?? employee.salary,
    });

    return this.employeesRepo.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findEmployeeOrFail(id);
    await this.employeesRepo.remove(employee);
  }

  private async findEmployeeOrFail(id: number): Promise<Employee> {
    const employee = await this.employeesRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException(`Employee #${id} not found`);
    return employee;
  }

  private async findDepartmentOrFail(id: number): Promise<Department> {
    const department = await this.departmentsRepo.findOne({ where: { id } });
    if (!department) throw new NotFoundException(`Department #${id} not found`);
    return department;
  }
}