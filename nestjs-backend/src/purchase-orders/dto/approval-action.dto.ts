import { IsEnum, IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ApprovalAction } from "../../common/types";

export class ApprovalActionDto {
  @ApiProperty({ enum: ApprovalAction, example: ApprovalAction.APPROVE })
  @IsEnum(ApprovalAction)
  action: ApprovalAction | undefined;

  @ApiProperty({
    example: "user-uuid-here",
    description: "ID of the user performing the action",
  })
  @IsString()
  userId: string | undefined;

  @ApiPropertyOptional({ example: "Looks good, approved!" })
  @IsString()
  @IsOptional()
  comment?: string;
}
