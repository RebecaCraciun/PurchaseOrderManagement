import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { User } from "./users/entities/user.entity";

async function seedUsersIfEmpty(dataSource: DataSource) {
  try {
    const userRepo = dataSource.getRepository(User);
    const count = await userRepo.count();
    if (count === 0) {
      const now = new Date();
      const users: Partial<User>[] = [
        {
          name: "Alin Popescu",
          email: "alice@rinf.com",
          role: "creator" as any,
          createdAt: now,
        },
        {
          name: "Ionut Ionescu",
          email: "ionut@rinf.com",
          role: "manager" as any,
          createdAt: now,
        },
        {
          name: "Ioana Vasilescu",
          email: "ioana@rinf.com",
          role: "it" as any,
          createdAt: now,
        },
        {
          name: "Diana Andreiescu",
          email: "diana@rinf.com",
          role: "finance" as any,
          createdAt: now,
        },
      ];
      await userRepo.insert(users as any);
      console.log("Seeded default users");
    }
  } catch (err) {
    console.warn("User seeding failed:", err);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("PO Approval System API")
    .setDescription("Purchase Order Approval Workflow System API")
    .setVersion("1.0")
    .addTag("users")
    .addTag("purchase-orders")
    .addTag("approval-history")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Seed users table for local development if empty
  try {
    const dataSource = app.get(DataSource);
    await seedUsersIfEmpty(dataSource);
  } catch (err) {
    console.warn("Could not run DB seeds:", err);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
