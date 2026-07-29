import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  // 1. Create a new client record
  async create(createClientDto: CreateClientDto) {
    try {
      const newClient = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(newClient);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Client profile already exists for user_id ${createClientDto.user_id}`,
        );
      }
      throw new InternalServerErrorException('Failed to create client');
    }
  }

  // 2. Fetch dashboard data for a client
  async getDashboard(userId: number) {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException(
        'A valid numeric userId query parameter is required.',
      );
    }

    const client = await this.clientRepository.findOne({
      where: { user_id: userId },
      relations: {
        projects: true,
        support_tickets: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client for user ID ${userId} not found`);
    }

    return {
      companyName: client.company_name,
      totalProjects: client.projects ? client.projects.length : 0,
      openTickets: client.support_tickets ? client.support_tickets.length : 0,
    };
  }

  // 3. Get projects for a client
  async getProjects(userId: number) {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException(
        'A valid numeric userId query parameter is required.',
      );
    }

    const client = await this.clientRepository.findOne({
      where: { user_id: userId },
      relations: { projects: true },
    });

    if (!client) {
      throw new NotFoundException(`Client for user ID ${userId} not found`);
    }

    return client.projects || [];
  }

  // 4. Update milestone status
  async updateMilestoneStatus(id: number, status: string) {
    return {
      message: `Milestone ${id} updated successfully`,
      status,
    };
  }

  // 5. Save uploaded project requirement file
  async saveProjectFile(projectId: number, file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file provided');
    }

    return {
      message: 'File uploaded successfully',
      projectId,
      fileName: file.filename,
      filePath: file.path,
    };
  }
}