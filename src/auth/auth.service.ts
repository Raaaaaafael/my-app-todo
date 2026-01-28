import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOneEntityByUsername(username);

    // Vergleich fixen (Unsafe member access .compare)
    const isMatch = await (bcrypt.compare(
      pass,
      user?.passwordHash || '',
    ) as Promise<boolean>);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    // Fix für .signAsync
    const token = await (this.jwtService.signAsync(payload) as Promise<string>);

    return { access_token: token };
  }
}
