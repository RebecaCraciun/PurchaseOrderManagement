"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./users/entities/user.entity");
async function seedUsersIfEmpty(dataSource) {
    try {
        const userRepo = dataSource.getRepository(user_entity_1.User);
        const count = await userRepo.count();
        if (count === 0) {
            const now = new Date();
            const users = [
                {
                    name: "Alin Popescu",
                    email: "alice@rinf.com",
                    role: "creator",
                    createdAt: now,
                },
                {
                    name: "Ionut Ionescu",
                    email: "ionut@rinf.com",
                    role: "manager",
                    createdAt: now,
                },
                {
                    name: "Ioana Vasilescu",
                    email: "ioana@rinf.com",
                    role: "it",
                    createdAt: now,
                },
                {
                    name: "Diana Andreiescu",
                    email: "diana@rinf.com",
                    role: "finance",
                    createdAt: now,
                },
            ];
            await userRepo.insert(users);
            console.log("Seeded default users");
        }
    }
    catch (err) {
        console.warn("User seeding failed:", err);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("PO Approval System API")
        .setDescription("Purchase Order Approval Workflow System API")
        .setVersion("1.0")
        .addTag("users")
        .addTag("purchase-orders")
        .addTag("approval-history")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    try {
        const dataSource = app.get(typeorm_1.DataSource);
        await seedUsersIfEmpty(dataSource);
    }
    catch (err) {
        console.warn("Could not run DB seeds:", err);
    }
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map