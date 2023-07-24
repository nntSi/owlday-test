import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthenModule } from './authen/authen.module';

@Module({
  imports: [UserModule, AuthenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
