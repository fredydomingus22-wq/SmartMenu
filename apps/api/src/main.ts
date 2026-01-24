import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT ?? 3001;
    const host = '0.0.0.0'; // Listen on all interfaces

    await app.listen(port, host);
    logger.log(`Application is running on: http://${host}:${port}`);
  } catch (err: any) {
    logger.error(`Failed to start application: ${err.message}`, err.stack);
    process.exit(1);
  }
}
bootstrap();
