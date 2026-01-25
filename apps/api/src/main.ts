import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    // Security headers middleware
    app.use((req: any, res: any, next: any) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

      // HSTS in production
      if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      }

      next();
    });

    // Enable CORS with security restrictions
    app.enableCors({
      origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com'] // Replace with actual domain
        : ['http://localhost:3000', 'http://localhost:3001', 'exp://localhost:8081'],
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Note: ThrottlerGuard is applied globally via ThrottlerModule in app.module.ts

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
