import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  const envName =
    configService.get('ENV_NAME') === 'PROD'
      ? ''
      : `-${configService.get('ENV_NAME')}`;

  const swaggerDocOptions = new DocumentBuilder()
    .setTitle(`Cloverbyte Portal${envName} API`)
    .setDescription(
      `Build: ${configService.get('BUILD_NUMBER')} Commit: ${configService.get(
        'COMMIT_SHORT_SHA',
      )}`,
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocOptions);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: { docExpansion: true }, // collapse all of the tags by default
  });

  const port = (configService.get('PORT') as number) || 3000;

  await app.listen(port);

  console.log(`Cloverbyte Portal${envName} API is running on port ${port}`);

  console.log('');
  console.log(`PORT ::: ${configService.get('PORT')} ...`);
  console.log(`ENV_NAME ::: ${configService.get('ENV_NAME')} ...`);
  console.log(`BUILD_NUMBER ::: ${configService.get('BUILD_NUMBER')} ...`);
  console.log(`COMMIT_SHA ::: ${configService.get('COMMIT_SHA')} ...`);
  console.log(
    `COMMIT_SHORT_SHA ::: ${configService.get('COMMIT_SHORT_SHA')} ...`,
  );
}
bootstrap();
