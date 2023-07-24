import { Module } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { AuthenController } from './authen.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService, UserService, AuthenService],
  controllers: [AuthenController],
})
export class AuthenModule {}
