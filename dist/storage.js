import { db } from "./db.js";
import { preorders } from "./shared/schema.js";
import { eq } from "drizzle-orm";
export const storage = {
    async createPreorder(data, discountCode) {
        const [preorder] = await db
            .insert(preorders)
            .values({
            ...data,
            discountCode,
        })
            .returning();
        return preorder;
    },
    async getPreorderByEmail(email) {
        const [preorder] = await db
            .select()
            .from(preorders)
            .where(eq(preorders.email, email))
            .limit(1);
        return preorder || null;
    },
    async getPreorderByCode(discountCode) {
        const [preorder] = await db
            .select()
            .from(preorders)
            .where(eq(preorders.discountCode, discountCode))
            .limit(1);
        return preorder || null;
    },
    async getAllPreorders() {
        return await db
            .select()
            .from(preorders);
    },
    async updatePreorder(id, data) {
        const [preorder] = await db
            .update(preorders)
            .set(data)
            .where(eq(preorders.id, id))
            .returning();
        return preorder || null;
    },
    async deletePreorder(id) {
        const result = await db
            .delete(preorders)
            .where(eq(preorders.id, id));
        return (result.rowCount ?? 0) > 0;
    },
    async getPreorderStats() {
        const allPreorders = await this.getAllPreorders();
        const stats = {
            total: allPreorders.length,
            byScent: {},
            newsletterSubscribers: allPreorders.filter(p => p.newsletter).length,
        };
        // Count by scent preference
        allPreorders.forEach(preorder => {
            if (preorder.preferredScent) {
                stats.byScent[preorder.preferredScent] = (stats.byScent[preorder.preferredScent] || 0) + 1;
            }
        });
        return stats;
    }
};
//# sourceMappingURL=storage.js.map