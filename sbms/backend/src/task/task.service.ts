import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { ClientsService } from 'src/clients/clients.service';
import { UploadedFileInfo } from 'src/common/interfaces/uploaded-file.interface';
import { RoleName } from 'src/roles/entities/role.entity';
import {CurrentUserPayload} from 'src/task/task.controller'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    private readonly employeesService: EmployeesService,
    private readonly clientsService: ClientsService,
  ) { }

  async getAll():Promise<Task[]> {
    const task = await this.taskRepo.find({
      relations: {
        employee: true
      },
      order: {
        deadline: 'ASC'
      }
    })
    return task
  }

  async getTaskById(id: number):Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: {
        id: id
      },
      relations: {
        employee: true
      }
    })

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    return task
  }

  async getTaskByEmployee(employeeId: number):Promise<Task[]> {
    const task = await this.taskRepo.find({
      where: {
        employee: {
          id: employeeId
        }
      },
      relations: {
        employee: true
      },
      order: {
        deadline: 'ASC'
      }
    })

    if (task.length === 0) {
      throw new BadRequestException('No tasks found for this employee');
    }

    return task
  }

  async getMyTasksAsEmployee(userId:number):Promise<Task[]>{
    const emp = await this.employeesService.findByUserId(userId)
    return this.taskRepo.find({
      where:{
        employee:{id:emp.id}
      },
      relations:{
        employee:true,client:true
      },
      order:{
        deadline:'ASC'
      }
    })
  }

  async getMyTasksAsClient(userId:number):Promise<Task[]>{
    const client = await this.clientsService.findByUserId(userId)
    return this.taskRepo.find({
      where:{
        client:{id:client.id}
      },
      relations:{
        employee:true,client:true
      },
      order:{
        deadline:'ASC'
      }
    })
  }

  async createTask(createTaskDto: CreateTaskDto):Promise<Task> {
    const emp = await this.employeeRepo.findOne({
      where: {
        id: createTaskDto.employeeId
      }
    })

    if (!emp) {
      throw new BadRequestException("Employee not found")
    }

    const task = this.taskRepo.create({
      ...createTaskDto,
      employee: emp
    })

    return await this.taskRepo.save(task)
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto):Promise<Task> {
    const task = await this.getTaskById(id)

    if (updateTaskDto.employeeId) {
      const employee = await this.employeeRepo.findOne({
        where: {
          id: updateTaskDto.employeeId,
        }
      })

      if (!employee) {
        throw new BadRequestException("Employee not found")
      }

      task.employee = employee
    }

    Object.assign(task, { ...updateTaskDto })

    return await this.taskRepo.save(task)
  }

  async updateProgress(id: number, updateProgressDto: UpdateProgressDto):Promise<Task> {
    const task = await this.getTaskById(id)
    task.progress = updateProgressDto.progress
    task.status = updateProgressDto.status

    return await this.taskRepo.save(task)
  }

    async uploadCompletedFile(id: number,file: UploadedFileInfo | undefined,currentUser: CurrentUserPayload): Promise<Task> {
    
      if (!file) {
      throw new BadRequestException('A file is required');
    }

    const task = await this.getTaskById(id);
    await this.assertEmployeeOwnsTaskIfEmployee(task, currentUser);

    task.completedFileName = file.originalname;
    task.completedFilePath = `completed/${file.filename}`;
    task.status = TaskStatus.COMPLETED;
    task.progress = 100;

    return await this.taskRepo.save(task);
  }

  async deleteTask(id: number):Promise<string> {
    const task = await this.getTaskById(id)
    this.taskRepo.remove(task);

    return `Task with ID ${id} deleted successfully`
  }

  async assertCanView(task: Task, currentUser: CurrentUserPayload): Promise<void> {
    if (
      currentUser.role === RoleName.SUPER_ADMIN ||
      currentUser.role === RoleName.MANAGER
    ) {
      return;
    }

    if (currentUser.role === RoleName.EMPLOYEE) {
      const employee = await this.employeesService.findByUserId(currentUser.userId);
      if (task.employee?.id !== employee.id) {
        throw new ForbiddenException('You can only view your own tasks');
      }
      return;
    }

    if (currentUser.role === RoleName.CLIENT) {
      const client = await this.clientsService.findByUserId(currentUser.userId);
      if (task.client?.id !== client.id) {
        throw new ForbiddenException('You can only view tasks linked to you');
      }
      return;
    }

    throw new ForbiddenException('Not authorized to view this task');
  }

  private async assertEmployeeOwnsTaskIfEmployee(task: Task,currentUser: CurrentUserPayload): Promise<void> {
    if (currentUser.role !== RoleName.EMPLOYEE) return;

    const employee = await this.employeesService.findByUserId(currentUser.userId);
    if (task.employee?.id !== employee.id) {
      throw new ForbiddenException('You can only act on tasks assigned to you');
    }
  }
}
