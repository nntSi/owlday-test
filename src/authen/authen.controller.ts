import { Body, Controller, Post } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { Prisma } from '@prisma/client';
import { SignInDto } from './dto/authen.dto';

@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

  @Post('register')
  async register(@Body() userCreateInput: Prisma.UserCreateInput) {
    return this.authenService.register(userCreateInput);
  }

  @Post('signin')
  async signIn(@Body() data: SignInDto) {
    return this.authenService.signIn(data);
  }
}
