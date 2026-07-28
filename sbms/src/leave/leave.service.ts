import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { Leave, LeaveStatus } from './entities/leave.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave) private readonly leaveRepo:Repository<Leave>,
    @InjectRepository(Employee) private readonly employeeRepo:Repository<Employee>
  ){}

  async getAll(){
    const lv = await this.leaveRepo.find({
      relations:{
        employee:true
      }
    })
    return lv
  }

  async getOneById(id:number){
    const lv = await this.leaveRepo.findOne({
      where:{id},
      relations:{
        employee:true
      }
    })
    return lv
  }

  async apply(dto:CreateLeaveDto){
    const emp = await this.employeeRepo.findOne({
      where:{
        id:dto.employeeId
      },
    })

    if(!emp){
      throw new BadRequestException(`Employee not found`)
    }

    const lv = await this.leaveRepo.create({
      reason:dto.reason,
      startDate:dto.startDate,
      endDate:dto.endDate,
      employee:emp
    });

    return await this.leaveRepo.save(lv)
  }

  async updateStatus(id:number,status:LeaveStatus){
    const lv = await this.getOneById(id)
    if (!lv) {
      throw new BadRequestException('Leave request not found');
    }
    lv.status=status
    return await this.leaveRepo.save(lv)
  }

  async delete(id:number){
    return await this.leaveRepo.delete(id);
  }
}
