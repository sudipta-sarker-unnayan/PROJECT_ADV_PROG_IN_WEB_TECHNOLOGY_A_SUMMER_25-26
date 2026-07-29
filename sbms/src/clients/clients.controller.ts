import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get('dashboard')
  getDashboard(@Query('userId') userId: number) {
    return this.clientsService.getDashboard(+userId);
  }

  @Patch('milestones/:id/approval')
  updateMilestoneApproval(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.clientsService.updateMilestoneStatus(+id, status);
  }

  @Post('projects/:id/upload-requirements')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  uploadRequirements(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.clientsService.saveProjectFile(+id, file);
  }
}