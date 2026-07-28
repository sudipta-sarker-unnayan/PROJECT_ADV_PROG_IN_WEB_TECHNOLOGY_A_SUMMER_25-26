import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { Attendence } from './entities/attendence.entity';

@Controller('attendence')
export class AttendenceController {
  constructor(
    private readonly attendenceService:AttendenceService
  ){}

  @Get()
  getAllAttendence(){
    const attendence = this.attendenceService.getAllAttendence()
    return attendence
  }

  @Get(':id')
  getAttendenceById(@Param('id')id:number){
    const attendence = this.attendenceService.getAttendenceById(id)
    return attendence
  }

  @Post()
  giveAttendence(@Body()createAttendenceDto:CreateAttendenceDto){
    const attendence = this.attendenceService.giveAttendence(createAttendenceDto)
    return attendence
  }
}
