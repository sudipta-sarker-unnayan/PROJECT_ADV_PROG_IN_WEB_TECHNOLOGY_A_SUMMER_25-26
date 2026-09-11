import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendence } from './entities/attendence.entity';
import { Repository } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectRepository(Attendence) private readonly attendenceRepo:Repository<Attendence>,
    @InjectRepository(Employee) private readonly employeeRepo:Repository<Employee>
  ){}

  async getAllAttendence(){
    const attendence = await this.attendenceRepo.find({
      relations:{
        employee:true
      },
      order:{
        date:'DESC'
      }
    })
    return attendence
  }

  async getAttendenceById(id:number){
    const attendence = await this.attendenceRepo.findOne({
      where:{id},
      relations:{
        employee:true
      }
    })
    return attendence;
  }

  async giveAttendence(createAttendenceDto){
    const emp = await this.employeeRepo.findOne({
      where:{
        id:createAttendenceDto.employeeId
      }
    })

    if(!emp){
      throw new BadRequestException('Employee not Found')
    }

    const attendence = this.attendenceRepo.create({
      date:createAttendenceDto.date,
      checkIn:createAttendenceDto.checkIn,
      checkOut:createAttendenceDto.checkOut,
      status:createAttendenceDto.status,
      employee:emp
    })
    return await this.attendenceRepo.save(attendence)
  }
}
