import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/authen.dto';

@Injectable()
export class AuthenService {
  constructor(private userService: UserService) {}

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
      include: {
        role: {
          include: {
            rolePermission: {
              include: { permission: true },
            },
          },
        },
      },
    });
    if (!user) {
      throw new BadRequestException('This email not found!!');
    }
    const { password: pwd, ...usr } = user;
    const match = compareSync(password, pwd);
    if (!match) {
      throw new BadRequestException('This password is not match!!');
    }
    return usr;
  }
}
