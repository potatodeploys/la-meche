
import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const preorders = pgTable('preorders', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  preferredScent: varchar('preferred_scent', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  newsletter: boolean('newsletter').default(false),
  discountCode: varchar('discount_code', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertPreorderSchema = createInsertSchema(preorders, {
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  preferredScent: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  newsletter: z.boolean().default(false),
}).omit({ id: true, discountCode: true, createdAt: true });

export const selectPreorderSchema = createSelectSchema(preorders);

export type InsertPreorder = z.infer<typeof insertPreorderSchema>;
export type Preorder = typeof preorders.$inferSelect;
