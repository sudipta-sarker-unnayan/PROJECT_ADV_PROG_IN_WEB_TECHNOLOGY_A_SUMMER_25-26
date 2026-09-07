import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Client } from '../clients/entities/client.entity';

export interface DashboardStats {
  totalUsers: number;
  totalEmployees: number;
  totalDepartments: number;
  totalClients: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeesRepo: Repository<Employee>,
    @InjectRepository(Client) private readonly clientsRepo: Repository<Client>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [totalUsers, totalEmployees, totalDepartments, totalClients] =
      await Promise.all([
        this.usersRepo.count(),
        this.employeesRepo.count(),
        this.departmentsRepo.count(),
        this.clientsRepo.count(),
      ]);

    return { totalUsers, totalEmployees, totalDepartments, totalClients };
  }
}