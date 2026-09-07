<<<<<<< Updated upstream
import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
=======
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
>>>>>>> Stashed changes

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
<<<<<<< Updated upstream
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'Password reset link has been sent to your email' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password has been reset successfully' };
  }
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    await this.usersService.changeOwnPassword(
      req.user.userId, 
      dto.currentPassword,
      dto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }
}
=======

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword(
    @CurrentUser() user: { sub: number; id?: number },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.sub ?? user.id, dto);
  }
}
>>>>>>> Stashed changes
