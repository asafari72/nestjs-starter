import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JSONResponseInterceptor } from './common/interceptors/json-response.interceptor';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_HOST, {
      dbName: process.env.DATABASE_NAME,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: 'APP_INTERCEPTOR', useClass: JSONResponseInterceptor },
    AppService,
  ],
})
export class AppModule {}
