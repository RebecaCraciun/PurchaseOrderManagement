import { POCategory } from "../../common/types";
export declare class CreatePurchaseOrderDto {
    title: string;
    description?: string;
    amount: number;
    category: POCategory;
    creatorId: string;
    submit?: boolean;
}
