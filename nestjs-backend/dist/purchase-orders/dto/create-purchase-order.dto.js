"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseOrderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("../../common/types");
class CreatePurchaseOrderDto {
    title;
    description;
    amount;
    category;
    creatorId;
    submit;
}
exports.CreatePurchaseOrderDto = CreatePurchaseOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "New Laptop for Development" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "High-performance laptop for engineering team",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreatePurchaseOrderDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: types_1.POCategory, example: types_1.POCategory.IT_EQUIPMENT }),
    (0, class_validator_1.IsEnum)(types_1.POCategory),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user-uuid-here" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseOrderDto.prototype, "creatorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: "Submit immediately (true) or save as draft (false)",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePurchaseOrderDto.prototype, "submit", void 0);
//# sourceMappingURL=create-purchase-order.dto.js.map