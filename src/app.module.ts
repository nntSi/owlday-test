import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthenModule } from './authen/authen.module';
import { ProductModule } from './product/product.module';
import { ControllerService } from './controller/controller.service';

@Module({
  imports: [UserModule, AuthenModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, ControllerService],
})
export class AppModule {}
