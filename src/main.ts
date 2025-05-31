import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0', () => console.log(`Listening at port ${port}`));
}
bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
