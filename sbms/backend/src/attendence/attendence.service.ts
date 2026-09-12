import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendence, AttendenceStatus } from './entities/attendence.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectRepository(Attendence)
    private readonly attendenceRepo: Repository<Attendence>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private readonly employeesService: EmployeesService,
  ) {}

  async getAllAttendence(): Promise<Attendence[]> {
    const attendence = await this.attendenceRepo.find({
      relations: {
        employee: true,
      },
      order: {
        date: 'DESC',
      },
    });
    return attendence;
  }

  async getAttendenceById(id: number): Promise<Attendence> {
    const attendence = await this.attendenceRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        employee: true,
      },
    });

    if (!attendence) {
      throw new BadRequestException(`Attendance with ID ${id} not found`);
    }

    return attendence;
  }

  async giveAttendence(
    createAttendenceDto: CreateAttendenceDto,
  ): Promise<Attendence> {
    const emp = await this.employeeRepo.findOne({
      where: {
        id: createAttendenceDto.employeeId,
      },
    });

    if (!emp) {
      throw new BadRequestException('Employee not Found');
    }

    const attendence = this.attendenceRepo.create({
      date: createAttendenceDto.date,
      checkIn: createAttendenceDto.checkIn,
      checkOut: createAttendenceDto.checkOut,
      status: createAttendenceDto.status,
      employee: emp,
    });
    return await this.attendenceRepo.save(attendence);
  }

  async checkIn(userId: number): Promise<Attendence> {
    const employee = await this.employeesService.findByUserId(userId);
    const today = new Date().toISOString().slice(0, 10);

    const existing = await this.attendenceRepo.findOne({
      where: { employee: { id: employee.id }, date: today as unknown as Date },
    });
    if (existing) {
      throw new ConflictException('You have already checked in today');
    }

    const now = new Date().toTimeString().slice(0, 8);
    const attendence = this.attendenceRepo.create({
      date: today as unknown as Date,
      checkIn: now,
      status: AttendenceStatus.PRESENT,
      employee,
    });

    return await this.attendenceRepo.save(attendence);
  }

  // Employee self-service: check out of today's attendance record.
  async checkOut(userId: number): Promise<Attendence> {
    const employee = await this.employeesService.findByUserId(userId);
    const today = new Date().toISOString().slice(0, 10);

    const attendence = await this.attendenceRepo.findOne({
      where: { employee: { id: employee.id }, date: today as unknown as Date },
    });

    if (!attendence) {
      throw new NotFoundException('No check-in found for today');
    }
    if (attendence.checkOut) {
      throw new ConflictException('You have already checked out today');
    }

    attendence.checkOut = new Date().toTimeString().slice(0, 8);
    return await this.attendenceRepo.save(attendence);
  }

  // Employee self-service: view their own attendance history.
  async getMyAttendence(userId: number): Promise<Attendence[]> {
    const employee = await this.employeesService.findByUserId(userId);
    return this.attendenceRepo.find({
      where: { employee: { id: employee.id } },
      relations: { employee: true },
      order: { date: 'DESC' },
    });
  }
}
