import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data: userCreateInput });
  }

  async findOne(userFindFirstArgs: Prisma.UserFindFirstArgs): Promise<User> {
    return this.prismaService.user.findFirst(userFindFirstArgs);
  }

  async findAll(userFindManyArgs: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async update(
    id: number,
    userUpdateInput: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: userUpdateInput,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prismaService.user.delete({ where: { id } });
  }
}
