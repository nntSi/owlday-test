import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { QueryProductDto, filterUserDto } from './dto/user.dto';
import { AuthenGuard } from 'src/authen/authen.guard';
import {
  PermissionsGuard,
  ProductGuard,
} from 'src/authorization/permission.guard';
import { Prisma } from '@prisma/client';

@Controller('user')
@UseGuards(AuthenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'read_user')
  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const { password, ...data } = await this.userService.findOne({
      where: { id: parseInt(id) },
    });
    return data;
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'update_user')
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userUpdateInput: Prisma.UserUpdateInput,
  ) {
    const { password, ...data } = await this.userService.update(
      parseInt(id),
      userUpdateInput,
    );
    return data;
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'delete_user')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(parseInt(id));
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'read_user')
  @Get()
  async findAllUser(@Query() query: filterUserDto) {
    const { email, fname, lname, roleId, skip, take } = query;
    const data = await this.userService.findAll({
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        password: false,
        role: true,
        roleId: true,
      },
      where: {
        email: email ? email : undefined,
        fname: fname ? fname : undefined,
        lname: lname ? lname : undefined,
        roleId: roleId ? parseInt(roleId) : undefined,
      },
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
    return data;
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'add_product')
  @Post('add/product')
  async addProduct(@Body() productCreateInput: Prisma.ProductCreateInput) {
    return this.userService.addProduct(productCreateInput);
  }

  @UseGuards(PermissionsGuard, ProductGuard)
  @SetMetadata('permission', 'update_product')
  @Patch('/update/product/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() productUpdateInput: Prisma.ProductUpdateWithoutUserInput,
  ) {
    return this.userService.updateProduct(
      parseInt(productId),
      productUpdateInput,
    );
  }

  @UseGuards(PermissionsGuard, ProductGuard)
  @SetMetadata('permission', 'read_product')
  @Get('/find/product/:productId')
  async findOneProduct(@Param('productId') productId: string) {
    return this.userService.findOneProduct(parseInt(productId));
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'read_product')
  @Get('/find/product')
  async findAllProduct(@Req() req: any, @Query() query: QueryProductDto) {
    const { skip, take } = query;
    return this.userService.findAllProduct({
      where: {
        userId: req.userId,
      },
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }
}
