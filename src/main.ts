import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { Server } from 'socket.io';
import { InventoryService } from './inventory/inventory.service';

async function bootstrap() {
  // Create the NestJS application instance using the AppModule
  const app = await NestFactory.create(AppModule);

  // Use Helmet middleware for enhanced security (e.g., setting various HTTP headers)
  app.use(helmet());

  // Enable CORS for all origins and common HTTP methods
  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  // Apply rate limiting to limit repeated requests to public APIs
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Use global validation pipes for transforming and validating incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // automatically transform payloads to be objects typed according to their DTO classes
      whitelist: true, // strip properties that do not have any decorators
      forbidNonWhitelisted: true, // throw an error if non-whitelisted properties are present
    }),
  );

  // Swagger configuration for API documentation
  const config = new DocumentBuilder()
    .setTitle('E-commerce API') // API title
    .setDescription('API documentation for the E-commerce application') // API description
    .setVersion('1.0') // API version
    .addBearerAuth() // Add bearer token authentication
    .addTag('default')
    .addTag('auth')
    .addTag('users')
    .addTag('products')
    .addTag('cart')
    .addTag('inventory')
    .build();

  // Create Swagger document and setup the Swagger module
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Define the port to listen on, default to 3000 if not specified in environment variables
  const PORT = process.env.PORT || 3000;
  console.log(`Configured Port: ${PORT}`);

  // Start the NestJS application
  const server = await app.listen(PORT, () => {
    console.log(`NestJS application is listening on port ${PORT}`);
  });

  // Create a new Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Get the InventoryService instance and set the Socket.IO server
  const inventoryService = app.get<InventoryService>(InventoryService);
  inventoryService.setServer(io);

  // Handle Socket.IO connection and disconnection events
  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

// Bootstrap the NestJS application
bootstrap();
