import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from 'src/product/product.service';

@Module({
  providers: [JwtService, PrismaService, ProductService, UserService],
  controllers: [UserController],
})
export class UserModule {}
