/**
 * One-time script to create the first Super Admin account.
 * Run with: npm run seed:admin
 *
 * Roles are auto-seeded on app boot (see roles.service.ts), so this
 * script only needs to insert the admin User row.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { RoleName } from '../roles/entities/role.entity';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@sbms.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345';

  const existing = await usersService.findByEmail(email);
  if (existing) {
    console.log(`Super admin already exists: ${email}`);
  } else {
    await usersService.create({
      name: 'Super Admin',
      email,
      password,
      role: RoleName.SUPER_ADMIN,
    });
    console.log(`Super admin created -> email: ${email}  password: ${password}`);
  }

  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
