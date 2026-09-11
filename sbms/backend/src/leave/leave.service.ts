import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Leave, LeaveStatus } from './entities/leave.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { ApplyLeaveSelfDto } from './dto/apply-leave-self.dto';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave) private readonly leaveRepo:Repository<Leave>,
    @InjectRepository(Employee) private readonly employeeRepo:Repository<Employee>,
    private readonly employeesService:EmployeesService
  ){}

  async getAll():Promise<Leave[]>{
    const leave = await this.leaveRepo.find({
      relations:{
        employee:true
      }
    })
    return leave
  }

  async getLeaveById(id:number):Promise<Leave>{
    const leave = await this.leaveRepo.findOne({
      where:{
        id:id
      },
      relations:{
        employee:true
      }
    })

    if(!leave){
      throw new BadRequestException(`Leave with ID ${id} not found`)
    }
    return leave
  }

  async apply(createLeaveDto:CreateLeaveDto):Promise<Leave>{
    const emp = await this.employeeRepo.findOne({
      where:{
        id:createLeaveDto.employeeId
      }
    })

    if(!emp){
      throw new BadRequestException("Employee not Found")
    }

    const leave = this.leaveRepo.create({
      reason:createLeaveDto.reason,
      startDate:createLeaveDto.startDate,
      endDate:createLeaveDto.endDate,
      employee:emp
    })

    return await this.leaveRepo.save(leave)
  }

  async applyForSelf(userId: number, dto: ApplyLeaveSelfDto): Promise<Leave> {
    const employee = await this.employeesService.findByUserId(userId);

    const leave = this.leaveRepo.create({
      reason: dto.reason,
      startDate: dto.startDate,
      endDate: dto.endDate,
      employee,
    });

    return await this.leaveRepo.save(leave);
  }

  async getMyLeaves(userId: number): Promise<Leave[]> {
    const employee = await this.employeesService.findByUserId(userId);
    return this.leaveRepo.find({
      where: { employee: { id: employee.id } },
      relations: { employee: true },
      order: { createAt: 'DESC' },
    });
  }

  async updateStatus(id:number,status:LeaveStatus):Promise<Leave>{
    const leave = await this.getLeaveById(id)
    
    if(!leave){
      throw new BadRequestException("Leave request not found")
    }

    leave.status = status
    return await this.leaveRepo.save(leave)
  }

  async delete(id: number):Promise<string>{
    const result = await this.leaveRepo.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException(
        `Leave with ID ${id} not found`,
      );
    }

    return `Leave with ID ${id} deleted successfully`;
  }

}
