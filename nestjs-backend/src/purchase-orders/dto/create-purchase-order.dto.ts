import { IsString, IsNumber, IsEnum, IsOptional, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { POCategory } from "../../common/types";

export class CreatePurchaseOrderDto {
  @ApiProperty({ example: "New Laptop for Development" })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    example: "High-performance laptop for engineering team",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ enum: POCategory, example: POCategory.IT_EQUIPMENT })
  @IsEnum(POCategory)
  category!: POCategory;

  @ApiProperty({ example: "user-uuid-here" })
  @IsString()
  creatorId!: string;
  @ApiPropertyOptional({
    example: true,
    description: "Submit immediately (true) or save as draft (false)",
  })
  @IsOptional()
  submit?: boolean;
}
