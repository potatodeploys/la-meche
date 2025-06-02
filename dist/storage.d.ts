import type { InsertPreorder, Preorder } from "./shared/schema";
export declare const storage: {
    createPreorder(data: InsertPreorder, discountCode: string): Promise<Preorder>;
    getPreorderByEmail(email: string): Promise<Preorder | null>;
    getPreorderByCode(discountCode: string): Promise<Preorder | null>;
    getAllPreorders(): Promise<Preorder[]>;
    updatePreorder(id: number, data: Partial<InsertPreorder>): Promise<Preorder | null>;
    deletePreorder(id: number): Promise<boolean>;
    getPreorderStats(): Promise<{
        total: number;
        byScent: Record<string, number>;
        newsletterSubscribers: number;
    }>;
};
//# sourceMappingURL=storage.d.ts.map