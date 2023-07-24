import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { filterUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    const { password, ...data } = await this.userService.findOne({
      where: { id: parseInt(id) },
    });
    return data;
  }

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
}
