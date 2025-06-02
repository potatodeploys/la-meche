
import { db } from "./db";
import { preorders } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InsertPreorder, Preorder } from "@shared/schema";

export const storage = {
  async createPreorder(data: InsertPreorder, discountCode: string): Promise<Preorder> {
    const [preorder] = await db
      .insert(preorders)
      .values({
        ...data,
        discountCode,
      })
      .returning();
    
    return preorder;
  },

  async getPreorderByEmail(email: string): Promise<Preorder | null> {
    const [preorder] = await db
      .select()
      .from(preorders)
      .where(eq(preorders.email, email))
      .limit(1);
    
    return preorder || null;
  },

  async getPreorderByCode(discountCode: string): Promise<Preorder | null> {
    const [preorder] = await db
      .select()
      .from(preorders)
      .where(eq(preorders.discountCode, discountCode))
      .limit(1);
    
    return preorder || null;
  },

  async getAllPreorders(): Promise<Preorder[]> {
    return await db
      .select()
      .from(preorders);
  },

  async updatePreorder(id: number, data: Partial<InsertPreorder>): Promise<Preorder | null> {
    const [preorder] = await db
      .update(preorders)
      .set(data)
      .where(eq(preorders.id, id))
      .returning();
    
    return preorder || null;
  },

  async deletePreorder(id: number): Promise<boolean> {
    const result = await db
      .delete(preorders)
      .where(eq(preorders.id, id));
    
    return result.rowCount > 0;
  },

  async getPreorderStats(): Promise<{
    total: number;
    byScent: Record<string, number>;
    newsletterSubscribers: number;
  }> {
    const allPreorders = await this.getAllPreorders();
    
    const stats = {
      total: allPreorders.length,
      byScent: {} as Record<string, number>,
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
