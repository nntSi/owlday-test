import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const permissions = req.permissions;
    const requiredPermission: string = this.reflector.get(
      'permission',
      context.getHandler(),
    );
    const checkPermission: boolean = permissions.includes(requiredPermission);
    if (!checkPermission) {
      throw new ForbiddenException('Insufficient Permission');
    }
    return true;
  }
}

@Injectable()
export class ProductGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.userId;
    const count = await this.prismaService.product.count({
      where: {
        id: parseInt(req.params.productId),
        userId,
      },
    });
    if (count < 1) {
      throw new ForbiddenException('Insufficient Permission');
    }
    return true;
  }
}
