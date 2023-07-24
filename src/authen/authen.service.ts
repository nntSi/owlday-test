import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/authen.dto';
import { JwtService } from '@nestjs/jwt';

const PRIVATE_KEY = process.env.PRIVATE_KEY;

@Injectable()
export class AuthenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userCreateInput: Prisma.UserCreateInput) {
    const { password } = userCreateInput;
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    const { password: ps, ...data } = await this.userService.create({
      ...userCreateInput,
      password: hash,
    });
    return data;
  }

  async signIn(data: SignInDto) {
    const { email, password } = data;
    const user = await this.userService.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('This email not found!!');
    }
    const { password: pwd, ...usr } = user;
    const match = compareSync(password, pwd);
    if (!match) {
      throw new BadRequestException('This password is not match!!');
    }
    return {
      access_token: await this.jwtService.signAsync(usr, {
        privateKey: PRIVATE_KEY,
      }),
    };
  }
}
