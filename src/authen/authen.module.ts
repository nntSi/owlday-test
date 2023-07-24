import { Module } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { AuthenController } from './authen.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from 'src/product/product.service';

@Module({
  providers: [
    PrismaService,
    ProductService,
    UserService,
    JwtService,
    AuthenService,
  ],
  controllers: [AuthenController],
})
export class AuthenModule {}
