import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { UserStatus } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }
    async forgotPassword(email: string): Promise<void> {
  const user = await this.usersService.findByEmail(email);
  console.log('User found:', user?.email); // temporary debug log
  if (!user) return;

  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 30 * 60 * 1000);

  await this.usersService.setResetToken(email, token, expiry);
  console.log('Reset link:', `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`); // temporary debug log

  const resetLink = `${this.config.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
  await this.mailService.sendPasswordResetEmail(email, resetLink);
  console.log('Email sent successfully'); // temporary debug log
}

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByValidResetToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    await this.usersService.resetPasswordWithToken(user, newPassword);
  }
}
