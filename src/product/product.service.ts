import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(productCreateInput: Prisma.ProductCreateInput) {
    return this.prismaService.product.create({ data: productCreateInput });
  }

  async findOne(productFindFirstArgs: Prisma.ProductFindFirstArgs) {
    return this.prismaService.product.findFirst(productFindFirstArgs);
  }

  async findAll(productFindManyArgs: Prisma.ProductFindManyArgs) {
    return this.prismaService.product.findMany(productFindManyArgs);
  }

  async update(
    productWhereInput: Prisma.ProductWhereUniqueInput,
    productUpdateInput: Prisma.ProductUpdateInput,
  ) {
    return this.prismaService.product.update({
      where: productWhereInput,
      data: productUpdateInput,
    });
  }

  async delete(userId: number, productId: number) {
    return this.prismaService.product.delete({
      where: { id: productId, userId },
    });
  }
}
