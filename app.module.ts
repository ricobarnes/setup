import { APIKeyService } from '@auth/api-key.service';
import { FirebaseService } from '@auth/firebase-app';
import { PreAuthMiddleware } from '@auth/pre-auth.middleware';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentModule } from '@resources/appointment/appointment.module';
import { BlogPostModule } from '@resources/blog-post/blog-post.module';
import { ContactModule } from '@resources/contact/contact.module';
import { DomainModule } from '@resources/domain/domain.module';
import { EventModule } from '@resources/event/event.module';
import { MediaModule } from '@resources/media/media.module';
import { OrderModule } from '@resources/order/order.module';
import { ProductModule } from '@resources/product/product.module';
import { TaskModule } from '@resources/task/task.module';
import { TypeOrmConfigService } from '@shared/typeorm/typeorm.service';
import { SubscriptionModule } from './billing/subscription/subscription.module';
import { UserModule } from './resources/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/envs/local.env',
      // envFilePath: 'src/envs/development.env',
      // envFilePath: 'src/envs/staging.env',
      // envFilePath: 'src/envs/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    SubscriptionModule,
    UserModule,
    BlogPostModule,
    AppointmentModule,
    ProductModule,
    TaskModule,
    EventModule,
    MediaModule,
    DomainModule,
    OrderModule,
    ContactModule,
  ],
  providers: [FirebaseService, APIKeyService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(PreAuthMiddleware)
      .exclude
      // { path: 'users', method: RequestMethod.GET },
      // { path: 'users', method: RequestMethod.GET },
      ()
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
