import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './public.decorator';
import { AuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReturnUserDto } from 'src/user/dto/return-user.dto';

@ApiTags('auth')
@Controller('api/auth') // Globaler Prefix /api wird in main.ts gesetzt
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Öffentlich zugänglich
  @Post('login')
  @ApiOperation({ summary: 'Benutzer anmelden' })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Public() // Öffentlich zugänglich
  @Post('register')
  @ApiOperation({ summary: 'Neuen Benutzer registrieren' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Benutzerprofil abrufen' })
  getProfile(@Request() req: { user: ReturnUserDto }) {
    return req.user;
  }
}
