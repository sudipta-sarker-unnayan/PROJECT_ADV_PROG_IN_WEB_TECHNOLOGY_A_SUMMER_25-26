import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleName } from './entities/role.entity';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  // Ensures the 4 SBMS roles always exist — safe to run on every boot.
  async onModuleInit() {
    for (const name of Object.values(RoleName)) {
      const exists = await this.rolesRepo.findOne({ where: { name } });
      if (!exists) {
        await this.rolesRepo.save(this.rolesRepo.create({ name }));
        this.logger.log(`Seeded role: ${name}`);
      }
    }
  }

  findAll(): Promise<Role[]> {
    return this.rolesRepo.find();
  }
}
