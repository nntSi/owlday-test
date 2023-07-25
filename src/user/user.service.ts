import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private productService: ProductService,
  ) {}

  async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data: userCreateInput });
  }

  async findOne(userFindFirstArgs: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst({
      ...userFindFirstArgs,
      include: {
        role: true,
      },
    });
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
      data: { ...userUpdateInput, password: undefined },
    });
  }

  async delete(id: number) {
    return this.prismaService.user.delete({
      where: { id },
      select: { email: true, fname: true, id: true, lname: true, role: true },
    });
  }

  async addProduct(productCreateInput: Prisma.ProductCreateInput) {
    return this.productService.create(productCreateInput);
  }

  async updateProduct(
    productId: number,
    productUpdateInput: Prisma.ProductUpdateWithoutUserInput,
  ) {
    return this.productService.update({ id: productId }, productUpdateInput);
  }

  async findOneProduct(productId: number) {
    return this.productService.findOne({ where: { id: productId } });
  }

  async findAllProduct(productFindManyArg: Prisma.ProductFindManyArgs) {
    return this.productService.findAll(productFindManyArg);
  }

  async deleteProduct(userId: number, productId: number) {
    return this.productService.delete(userId, productId);
  }
}
