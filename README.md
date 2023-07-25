# Exam-backend-1 | Wachirawit
แบบทดสอบ Backend ข้อที่ 1 บริษัท อาวล์ เดย์ เฮ้าส์ จำกัด

## ผู้ทำแบบทดสอบ
```bash
- นายวชิรวิทย์ สีหะวงษ์
```
## คำถาม
#### 1. เมื่อเกิดปัญหาโค้ดติดบั๊กจงอธิบายสิ่งที่ต้องทำเป็นสเต็ป
```bash
1.1 กรณีมีแจ้ง Error หรือ Complie ไม่ผ่าน
  1.1.1 อ่านแจ้งเตือนที่ระบบแจ้ง
  1.1.2 แก้ไขตามที่ระบบแจ้ง
1.2 กรณีไม่มีแจ้งเตือน แต่มีการทำงานที่ผิดปกติ ผลลัพธ์ไม่เป็นไปตามที่คาดหวัง
  1.2.1 ประเมินว่าสิ่งที่เกิดขึ้นเกี่ยวข้องกับฟังก์ชั่นใดบ้าง
  1.2.2 เริ่มไล่จากฟังก์ชั่นที่คาดว่าได้รับอินพุตเป็นอันดับแรก
  1.2.3 ไล่ฟังก์ชั่นที่เกี่ยวข้องลำดับถัดมาไปเรื่อยๆ จะเจอต้นตอของบั๊ก  
1.3 กรณีก๊อปโค้ดเขามา หรือปัญหาที่ไม่มีประสบการณ์มาก่อน
  1.3.1 เสิช Error ใน Google จะมีคอมมูนิตี้ Stack overflow, Git hub 
  1.3.2 ถาม Chat GPT และลองถามตามเบื้องต้นดู
```
#### 2. อธิบายความแตกต่างระหว่าง Middleware และ Interceptor ใน NestJS และให้ยกตัวอย่างการใช้งานของแต่ละอัน
```bash
- Middleware เป็นฟังก์ชั่นที่ใช้กับตัวจัดการเส้นทาง ซึ่งจะทำงานก่อนที่จะเรียกใช้ตัวจัดการเส้นทาง โดยปกติจะใช้กับพวก Authentication ตรวจสอบ Token จาก Client ก่อนการขอข้อมูล หรือก่อนเข้าถึงการใช้งานฟังก์ชั่นอื่นๆ ใน Application

  Client Side -> Middleware -> @RequestMapping
  ------------------------------------------------------------------------

- Interceptors มีความคล้ายกับ Middleware แต่จะทำงานได้ทั้งตอน ก่อนการเข้าถึงฟังก์ชั่นและหลังจากเสร็จสิ้นการทำงานของฟังก์ชั่น สามารถใช้กับการ Log ค่า Request ต่างๆ หรือปรับแต่งข้อมูลให้พร้อม ก่อนที่จะเข้าถึงฟังก์ชั่น หรือปรับแต่งข้อมูลก่อนส่งให้กลับ Client
  
  Client Side <-> Interceptors <-> @Get, @Post, @Patch, @Delete
  ------------------------------------------------------------------------
```

#### 3. อธิบายและแสดงตัวอย่างการใช้งาน Guards ใน NestJS เพื่อการรับรองการเข้าถึงและการตรวจสอบสิทธิ์ในเส้นทางของ API
```bash
มีความคล้ายกับ Middleware แต่จะใช้กับ Logic ที่เฉพาะเจาะจง หรือการกำหนด Permission ในการเข้าถึงฟังก์ชั่นก่อนที่จะเข้าถึงฟังก์ชั่นนั้น
```
##### ข้อมูลใน tokenExtract (1)
```typescript
tokenExtract = {
  email: 'wachirawit.ntsi@gmail.com',
  userId: 4,
  permissions: [ 'read_user', 'new_stock', 'edit_stock', 'add_stock' ],
  iat: 1689602129,
  exp: 1689605729
}
```

##### สร้าง PermissionsGuard
```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExtract } from '../dto/token.dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {

    // ทำการเอาข้อมูล Permissions ที่ได้จากการนำ Token ไป Decrypt จาก Middleware (1)
    const req = context.switchToHttp().getRequest();
    const tokenExtract: TokenExtract = req.user;

    // รับค่าจาก reflector ที่ได้จาก SetMetadata ในกรณีนี้ผมรับเป็น String เดี่ยวๆ
    const requiredPermission: string = this.reflector.get(
      'permissions',
      context.getHandler(),
    );
    
    // เช็คว่าค่า Permission ที่ต้องการมีอยู่ใน tokenExtract ของเราหรือไม่
    const checkPermission: boolean =
      tokenExtract.permissions.includes(requiredPermission);
    if (!checkPermission) {
      throw new ForbiddenException('Insufficient Permission');
    }
    return true;
  }
}
```
##### นำมาใช้งาน
```typescript
import {
  Controller,
  Get,
  Param,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PermissionsGuard } from 'src/authorization/permissions/permissions.guard';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @SetMetadata('permissions', 'read_user')
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const { password, ...data_nopassword } = await this.userService.user({
      id: parseInt(id),
    });
    return data_nopassword;
  }
}
```

#### 4. เขียน sql file จาก requirement ที่กำหนดให้ต่อไปนี้
ไฟล์ [exam-4.sql](exam-4.sql)

#### 5. สร้างโปรเจค NestJS เพื่อนำไปพัฒนาระบบดังต่อไปนี้
##### ติดตั้งโปรเจ็ค
```bash
npm install
```
##### ใช้งาน Development
```bash
npm run start:dev
```

## Api Document
[Postman Link](https://documenter.getpostman.com/view/23612663/2s946o3oas)
