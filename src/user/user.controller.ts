import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { filterUserDto } from './dto/user.dto';
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
  @SetMetadata('permission', 'read_user')
  @Get()
  async findAllUser(@Query() query: filterUserDto) {
    const { email, fname, lname, roleId } = query;
    const data = await this.userService.findAll({
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        password: false,
        products: true,
        role: true,
        roleId: true,
      },
      where: {
        email: email ? email : undefined,
        fname: fname ? fname : undefined,
        lname: lname ? lname : undefined,
        roleId: roleId ? parseInt(roleId) : undefined,
      },
    });
    return data;
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'add_product')
  @Post('add/product')
  async addProduct(@Body() productCreateInput: Prisma.ProductCreateInput) {
    this.userService.addProduct(productCreateInput);
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
}
