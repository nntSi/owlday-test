import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService, ProductService],
})
export class ProductModule {}
