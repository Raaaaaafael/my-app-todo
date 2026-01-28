import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CorrId } from '../decorators/corr-id.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import type { UserRequest } from '../types/user-request.dto';
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@CorrId() corrId: number, @Body() signInDto: SignInDto) {
    this.logger.log(
      `${corrId} ${this.signIn.name} with: ${JSON.stringify(
        signInDto,
        null,
        2,
      )}`,
    );
    return this.authService.signIn(corrId, signInDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getProfile(@Request() req: UserRequest) {
    return req.user;
  }
}
