import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>
  ) { }

  async getAll() {
    return await this.taskRepo.find({
      relations: {
        employee: true
      },
      order: {
        deadline: 'ASC',
      },
    });
  }

  async getOne(id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: {
        employee: true
      },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    return task;
  }

  async getTaskByEmployee(employeeId: number) {
    return await this.taskRepo.find({
      where: {
        employee: {
          id: employeeId,
        },
      },
      relations: {
        employee: true
      },
      order: {
        deadline: 'ASC',
      },
    });
  }

  async createTask(dto: CreateTaskDto) {
    const emp = await this.employeeRepo.findOne({
      where: {
        id: dto.employeeId,
      },
    });

    if (!emp) {
      throw new BadRequestException('Employee not found');
    }

    const task = this.taskRepo.create({
      ...dto,
      employee: emp
    });

    return await this.taskRepo.save(task);
  }

  async updateTask(id: number, dto: UpdateTaskDto) {
    const task = await this.getOne(id);

    if (dto.employeeId) {
      const employee = await this.employeeRepo.findOne({
        where: {
          id: dto.employeeId,
        },
      });

      if (!employee) {
        throw new BadRequestException('Employee not found');
      }

      task.employee = employee;
    }

    Object.assign(task, {
      ...dto,
    });

    return await this.taskRepo.save(task);
  }

  async updateProgress(
    id: number,
    dto: UpdateProgressDto,
  ) {
    const task = await this.getOne(id);

    task.progress = dto.progress;
    task.status = dto.status;

    return await this.taskRepo.save(task);
  }

  async deleteTask(id:number) {
    const task = await this.getOne(id);

    return await this.taskRepo.remove(task);
  }
}
